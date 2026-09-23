import path from 'path';
import fs from 'fs';
import { Telegraf, Markup } from 'telegraf';
import config from '../config/index.js';
import MiningService from '../services/miningService.js';
import WithdrawalRequest from '../models/WithdrawalRequest.js';

export const bot = new Telegraf(config.telegram.botToken || 'dummy_token_for_init');

/**
 * Configure bot commands and event handlers
 */
export function setupBotHandlers(botInstance) {
  // Global error handler for Telegraf to prevent unhandled rejections
  botInstance.catch((err, ctx) => {
    console.error(`❌ Bot error encountered for update ${ctx?.updateType}:`, err.message);
  });

  // Log incoming messages for debugging
  botInstance.use((ctx, next) => {
    if (ctx.message?.text) {
      console.log(`📩 [Telegram Message] From ${ctx.from?.id} (@${ctx.from?.username || 'none'}): ${ctx.message.text}`);
    }
    return next();
  });

  // Register Bot commands and Menu Button in Telegram
  try {
    botInstance.telegram.setMyCommands([
      { command: 'start', description: '🚀 Start Mining Bot' },
      { command: 'app', description: '⚡ Open Mini App' },
      { command: 'help', description: '💡 Guide & Support' },
    ]).catch((err) => {
      console.warn('⚠️ Could not register bot commands with Telegram:', err.message);
    });

    if (config.telegram.webAppUrl) {
      botInstance.telegram.setChatMenuButton({
        menu_button: {
          type: 'web_app',
          text: '⚡ TVA Mining',
          web_app: { url: config.telegram.webAppUrl },
        },
      }).catch((err) => {
        console.warn('⚠️ Could not set chat menu button:', err.message);
      });
    }
  } catch (err) {
    console.warn('⚠️ Menu button / commands setup error:', err.message);
  }

  // 1. /start command: STRICTLY IN ENGLISH ONLY as per client mandate
  botInstance.command('start', async (ctx) => {
    try {
      const text = ctx.message?.text || '';
      const parts = text.split(/\s+/);
      const payload = parts.length > 1 ? parts[1].trim() : '';
      let referrerId = null;
      if (payload) {
        const clean = payload.replace(/^ref_?/i, '').trim();
        const parsed = parseInt(clean, 10);
        if (!isNaN(parsed) && parsed > 0) {
          referrerId = parsed;
        }
      }

      // Check if user exists or create new user with 4-level referral tracking
      const user = await MiningService.getOrCreateUser(ctx.from, referrerId);
      const currentRate = user.calculateDailyMiningRate();
      const botUsername = ctx.botInfo?.username || config.telegram.botUsername || 'TVAMining_bot';

      const welcomeText =
        `⚡ *Welcome to TVA Cloud TON Mining Bot!* ⚡\n\n` +
        `🚀 Start mining TON cryptocurrency now at maximum speed via our Telegram Mini App.\n\n` +
        `💎 *Ways to Earn Points & Boost Mining Hashrate:*\n` +
        `• 📺 *Watch Ads:* Earn +1 Point for every daily ad you watch.\n` +
        `• 🤖 *Automated Mining Rigs:* Advanced units that provide daily TON profits directly.\n` +
        `• 👥 *4-Tier Referral Rewards:*\n` +
        `   🥇 Level 1: *+1.0 Point* per user earn\n` +
        `   🥈 Level 2: *+0.5 Point* per user earn\n` +
        `   🥉 Level 3: *+0.25 Point* per user earn\n` +
        `   🎖️ Level 4: *+0.1 Point* per user earn\n` +
        `• 📋 *Partner Tasks:* Subscribe to partner channels for instant bonuses.\n\n` +
        `📊 *Your Account Stats:*\n` +
        `• 💰 *TON Balance:* \`${user.tonBalance.toFixed(4)} TON\`\n` +
        `• ⚡ *Mining Rate:* \`${currentRate} TON/day\`\n` +
        `• 🎯 *Total Points:* \`${user.totalPoints} PTS\`\n` +
        `• 🤝 *Direct Referrals:* \`${user.activeReferralsCount}\`\n\n` +
        `💡 *Conversion Formula:* 1 Point = 0.0001 TON / day\n\n` +
        `Tap the *🚀 Launch App* button below to open the Mini App and start mining! 👇`;

      const shareText = encodeURIComponent('Join TVA Mining Bot and start mining TON cryptocurrency daily for free! 🚀💎');
      const shareUrl = `https://t.me/share/url?url=https://t.me/${botUsername}?start=ref_${ctx.from.id}&text=${shareText}`;

      const keyboard = Markup.inlineKeyboard([
        [Markup.button.webApp('🚀 Launch App', config.telegram.webAppUrl)],
        [Markup.button.url('👥 Invite Friends', shareUrl)],
      ]);

      const mascotPath = path.resolve(process.cwd(), 'public', 'img', 'robots', 'mascot.jpg');
      if (fs.existsSync(mascotPath)) {
        await ctx.replyWithPhoto({ source: mascotPath }, {
          caption: welcomeText,
          parse_mode: 'Markdown',
          ...keyboard,
        }).catch(async (photoErr) => {
          console.warn('⚠️ replyWithPhoto failed, fallback to reply text:', photoErr.message);
          await ctx.reply(welcomeText, { parse_mode: 'Markdown', ...keyboard });
        });
      } else {
        await ctx.reply(welcomeText, {
          parse_mode: 'Markdown',
          ...keyboard,
        });
      }
    } catch (err) {
      console.error('Error handling /start command:', err);
      try {
        await ctx.reply('Welcome to TVA Bot! Tap below to open the app:', {
          ...Markup.inlineKeyboard([
            [Markup.button.webApp('🚀 Launch App', config.telegram.webAppUrl)],
          ]),
        });
      } catch (_) {}
    }
  });

  // 2. /app command: English Mini App direct launcher
  botInstance.command('app', async (ctx) => {
    try {
      const appText = `🚀 *TVA Mining App is Ready!*\n\nTap the button below to open the Mini App, track mining earnings, claim tokens, and complete daily tasks:`;
      await ctx.reply(appText, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.webApp('🚀 Launch App', config.telegram.webAppUrl)],
        ]),
      });
    } catch (err) {
      console.error('Error handling /app command:', err);
    }
  });

  // 3. /help command: English Guide & Support
  botInstance.command('help', async (ctx) => {
    try {
      const helpText =
        `💡 *TVA TON Mining Bot Guide & FAQ:*\n\n` +
        `🔹 *How Does It Work?*\n` +
        `The ecosystem is driven by "Points" that define your daily mining hashrate:\n` +
        `• Each *1 Point = 0.0001 TON daily*.\n` +
        `• Claim accumulated earnings anytime to add them to your withdrawable balance.\n\n` +
        `🔹 *Ways to Earn Points:*\n` +
        `1️⃣ *Watch Ads:* In Tasks tab, watch ads daily (+1 Point/ad).\n` +
        `2️⃣ *Mining Rigs:* Permanent lifetime upgrades granting points & daily yield.\n` +
        `3️⃣ *4-Level Referral System:*\n` +
        `   • Level 1 (Direct): 1 Point per earn\n` +
        `   • Level 2: 0.5 Point per earn\n` +
        `   • Level 3: 0.25 Point per earn\n` +
        `   • Level 4: 0.1 Point per earn\n` +
        `4️⃣ *Partner Tasks:* Subscribe to partner channels for instant bonuses.\n\n` +
        `🔹 *Withdrawal Terms:*\n` +
        `• Minimum Withdrawal: 0.1 TON only.\n` +
        `• Network Fee: 5% TON network fee.\n` +
        `• Eligibility: Complete at least 15 daily ads.\n\n` +
        `📞 *Technical Support:* [@TVA_Support_Help](https://t.me/TVA_Support_Help)`;

      await ctx.reply(helpText, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        ...Markup.inlineKeyboard([
          [Markup.button.webApp('🚀 Launch App', config.telegram.webAppUrl)],
          [Markup.button.url('💬 Support', 'https://t.me/TVA_Support_Help')],
        ]),
      });
    } catch (err) {
      console.error('Error handling /help command:', err);
    }
  });

  // Admin action callbacks for withdrawal requests
  botInstance.action(/^approve_withdrawal_(.+)$/, async (ctx) => {
    if (String(ctx.from.id) !== String(config.telegram.adminId)) {
      return ctx.answerCbQuery('Unauthorized action', { show_alert: true });
    }

    const requestId = ctx.match[1];
    try {
      const req = await WithdrawalRequest.findById(requestId);
      if (!req) return ctx.answerCbQuery('Withdrawal request not found');
      if (req.status !== 'pending') return ctx.answerCbQuery(`Current status: ${req.status}`);

      req.status = 'approved';
      await req.save();

      // Broadcast premium formatted proof to @TVA_Payment channel with bot logo image
      try {
        const rawId = String(req.telegramId || '');
        const maskedId = rawId.length > 4 ? `${rawId.slice(0, 4)}***${rawId.slice(-2)}` : rawId;
        const amountDisplay = `${Number((req.netAmountTon || req.amountTon).toFixed(4))} TON`;

        const proofMessage =
          `💎 *PAYMENT SENT*\n\n` +
          `🚀 *Withdrawal Completed Successfully*\n\n` +
          `👤 *User:* \`${maskedId}\`\n` +
          `💰 *Amount:* \`${amountDisplay}\`\n` +
          `🟣 *Network:* TON\n` +
          `✅ *Status:* SUCCESSFUL\n` +
          `━━━━━━━━━━━━━━━━━━━━\n\n` +
          `💎 *Your reward has been processed and sent directly to your TON Wallet.*\n\n` +
          `🔗 *Transaction:* Verified On-Chain\n` +
          `⚡ *Processing:* Fast & Secure\n\n` +
          `🏆 *TVA Mining*\n` +
          `_Earn • Complete • Get Paid_`;

        const txUrl = req.walletAddress
          ? `https://tonviewer.com/${req.walletAddress}`
          : 'https://tonviewer.com';
        const webAppUrl = config.telegram.webAppUrl || `https://t.me/${config.telegram.botUsername || 'TVAMining_bot'}`;

        const inlineKeyboard = {
          inline_keyboard: [
            [
              { text: '🔍 View Transaction', url: txUrl },
              { text: '🚀 Open TVA Mining', url: webAppUrl },
            ],
          ],
        };

        const bannerPath = path.resolve(process.cwd(), 'img', 'payout_banner.jpg');
        const logoPath = path.resolve(process.cwd(), 'img', 'TVA.jpg');
        const photoPath = fs.existsSync(bannerPath) ? bannerPath : (fs.existsSync(logoPath) ? logoPath : null);

        if (photoPath) {
          await ctx.telegram.sendPhoto('@TVA_Payment', { source: photoPath }, {
            caption: proofMessage,
            parse_mode: 'Markdown',
            reply_markup: inlineKeyboard,
          }).catch(async (err) => {
            console.warn('⚠️ sendPhoto failed, fallback to sendMessage:', err.message);
            await ctx.telegram.sendMessage('@TVA_Payment', proofMessage, {
              parse_mode: 'Markdown',
              reply_markup: inlineKeyboard,
            });
          });
        } else {
          await ctx.telegram.sendMessage('@TVA_Payment', proofMessage, {
            parse_mode: 'Markdown',
            reply_markup: inlineKeyboard,
          });
        }
      } catch (postErr) {
        console.warn('⚠️ Could not post proof to @TVA_Payment:', postErr.message);
      }

      await ctx.editMessageText(
        `${ctx.callbackQuery.message.text}\n\n✅ *Status: APPROVED by admin*`,
        { parse_mode: 'Markdown' }
      );
      await ctx.answerCbQuery('Withdrawal approved successfully!');
    } catch (err) {
      ctx.answerCbQuery('Error: ' + err.message);
    }
  });


  botInstance.action(/^reject_withdrawal_(.+)$/, async (ctx) => {
    if (String(ctx.from.id) !== String(config.telegram.adminId)) {
      return ctx.answerCbQuery('غير مصرح لك بهذا الإجراء', { show_alert: true });
    }

    const requestId = ctx.match[1];
    try {
      const req = await WithdrawalRequest.findById(requestId);
      if (!req) return ctx.answerCbQuery('طلب السحب غير موجود');
      if (req.status !== 'pending') return ctx.answerCbQuery(`الحالة الحالية: ${req.status}`);

      req.status = 'rejected';
      await req.save();

      await ctx.editMessageText(
        `${ctx.callbackQuery.message.text}\n\n❌ *الحالة: تم الرفض بواسطة المسؤول (REJECTED)*`,
        { parse_mode: 'Markdown' }
      );
      await ctx.answerCbQuery('تم رفض طلب السحب.');
    } catch (err) {
      ctx.answerCbQuery('خطأ: ' + err.message);
    }
  });
}

export default bot;
