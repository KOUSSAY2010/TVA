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
      { command: 'start', description: '🚀 ابدأ تشغيل البوت' },
      { command: 'app', description: '⚡ فتح تطبيق التعدين' },
      { command: 'help', description: '💡 تعليمات وطرق الكسب والدعم' },
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

  // 1. /start command with referral tracking & professional welcome (Auto-language AR/EN)
  botInstance.command('start', async (ctx) => {
    const isAr = (ctx.from?.language_code || '').toLowerCase().startsWith('ar');

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

      // Check if user exists or create new user with referrer ID
      const user = await MiningService.getOrCreateUser(ctx.from, referrerId);
      const currentRate = user.calculateDailyMiningRate();
      const botUsername = ctx.botInfo?.username || config.telegram.botUsername || 'TVAMining_bot';

      let welcomeText;
      let shareText;
      let btnLaunch;
      let btnInvite;

      if (isAr) {
        welcomeText =
          `⚡ *أهلاً بك في بوت TVA لتعدين TON السحابي!* ⚡\n\n` +
          `🚀 ابدأ الآن في تعدين عملة TON مجاناً وبأعلى سرعة ممكنة عبر تطبيقنا المصغر.\n\n` +
          `💎 *طرق كسب النقاط ومضاعفة سرعة التعدين:*\n` +
          `• 📺 *مشاهدة الإعلانات:* اكسب +1 نقطة لكل إعلان تشاهده يومياً.\n` +
          `• 🤖 *منصات التعدين الآلية:* ترقيات متقدمة تمنحك أرباح TON يومية مستمرة مباشرة.\n` +
          `• 👥 *دعوة الأصدقاء:* اكسب 10 نقاط لكل صديق يصبح نشطاً.\n` +
          `• 📋 *المهام السريعة:* اشترك في قنواتنا وتابع شركاءنا واربح نقاطاً إضافية.\n\n` +
          `📊 *إحصائيات حسابك:*\n` +
          `• 💰 *رصيد TON:* \`${user.tonBalance.toFixed(4)} TON\`\n` +
          `• ⚡ *معدل التعدين:* \`${currentRate} TON/يوم\`\n` +
          `• 🎯 *مجموع النقاط:* \`${user.totalPoints} نقطة\`\n` +
          `• 🤝 *الإحالات النشطة:* \`${user.activeReferralsCount}\`\n\n` +
          `💡 *معادلة التحويل:* 1 نقطة = 0.0001 TON / يومياً\n\n` +
          `اضغط على زر *🚀 ابدأ الآن* أدناه للدخول إلى التطبيق وبدء التعدين! 👇`;
        shareText = encodeURIComponent('انضم إلى منصة TVA وابدأ في تعدين عملة TON يومياً مجاناً! 🚀💎');
        btnLaunch = '🚀 ابدأ الآن';
        btnInvite = '👥 دعوة الأصدقاء';
      } else {
        welcomeText =
          `⚡ *Welcome to TVA Cloud TON Mining Bot!* ⚡\n\n` +
          `🚀 Start mining TON cryptocurrency now at maximum speed via our Telegram Mini App.\n\n` +
          `💎 *Ways to Earn Points & Boost Mining Hashrate:*\n` +
          `• 📺 *Watch Ads:* Earn +1 Point for every daily ad you watch.\n` +
          `• 🤖 *Automated Mining Rigs:* Advanced units that provide daily TON profits directly.\n` +
          `• 👥 *Invite Friends:* Earn 10 points for every friend who becomes active.\n` +
          `• 📋 *Partner Tasks:* Subscribe to our channels and earn instant rewards.\n\n` +
          `📊 *Your Account Stats:*\n` +
          `• 💰 *TON Balance:* \`${user.tonBalance.toFixed(4)} TON\`\n` +
          `• ⚡ *Mining Rate:* \`${currentRate} TON/day\`\n` +
          `• 🎯 *Total Points:* \`${user.totalPoints} PTS\`\n` +
          `• 🤝 *Active Referrals:* \`${user.activeReferralsCount}\`\n\n` +
          `💡 *Conversion Formula:* 1 Point = 0.0001 TON / day\n\n` +
          `Tap the *🚀 Launch App* button below to open the Mini App and start mining! 👇`;
        shareText = encodeURIComponent('Join the TVA platform and start mining TON cryptocurrency daily for free! 🚀💎');
        btnLaunch = '🚀 Launch App';
        btnInvite = '👥 Invite Friends';
      }

      const shareUrl = `https://t.me/share/url?url=https://t.me/${botUsername}?start=ref_${ctx.from.id}&text=${shareText}`;

      const keyboard = Markup.inlineKeyboard([
        [Markup.button.webApp(btnLaunch, config.telegram.webAppUrl)],
        [Markup.button.url(btnInvite, shareUrl)],
      ]);

      await ctx.reply(welcomeText, {
        parse_mode: 'Markdown',
        ...keyboard,
      });
    } catch (err) {
      console.error('Error handling /start command:', err);
      try {
        const fallbackBtn = isAr ? '🚀 ابدأ الآن' : '🚀 Launch App';
        const fallbackMsg = isAr ? 'مرحباً بك في بوت TVA! اضغط على الزر أدناه لفتح التطبيق:' : 'Welcome to TVA Bot! Tap below to open the app:';
        await ctx.reply(fallbackMsg, {
          ...Markup.inlineKeyboard([
            [Markup.button.webApp(fallbackBtn, config.telegram.webAppUrl)],
          ]),
        });
      } catch (_) {}
    }
  });

  // 2. /app command: Compact direct launcher
  botInstance.command('app', async (ctx) => {
    const isAr = (ctx.from?.language_code || '').toLowerCase().startsWith('ar');
    try {
      const appText = isAr
        ? `🚀 *تطبيق TVA Mining جاهز للعمل!*\n\nاضغط على الزر أدناه لفتح التطبيق ومتابعة أرباح التعدين، جمع العملات، وتنفيذ المهام اليومية:`
        : `🚀 *TVA Mining App is Ready!*\n\nTap the button below to open the Mini App, track mining earnings, claim tokens, and complete daily tasks:`;

      const btnText = isAr ? '🚀 ابدأ الآن' : '🚀 Launch App';

      await ctx.reply(appText, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.webApp(btnText, config.telegram.webAppUrl)],
        ]),
      });
    } catch (err) {
      console.error('Error handling /app command:', err);
    }
  });

  // 3. /help command: Instructions on earning points, rigs, and support contact
  botInstance.command('help', async (ctx) => {
    const isAr = (ctx.from?.language_code || '').toLowerCase().startsWith('ar');
    try {
      let helpText;
      let btnLaunch;
      let btnSupport;

      if (isAr) {
        helpText =
          `💡 *دليل وتعليمات بوت TVA لتعدين TON:*\n\n` +
          `🔹 *كيف تعمل المنظومة؟*\n` +
          `النظام يعتمد على "النقاط" (Points) التي تحدد معدل تعدينك اليومي:\n` +
          `• كل *1 نقطة = 0.0001 TON يومياً*.\n` +
          `• يمكنك المطالبة بأرباحك بانتظام لتضاف إلى رصيدك القابل للسحب.\n\n` +
          `🔹 *طرق كسب النقاط وزيادة الأرباح:*\n` +
          `1️⃣ *مشاهدة الإعلانات:* من تبويب المهام، شاهد حتى 40 إعلاناً يومياً (1 نقطة/إعلان).\n` +
          `2️⃣ *شراء منصات التعدين (Rigs):* ترقيات دائمة مدى الحياة تمنحك حتى 60,000 نقطة وأكثر.\n` +
          `3️⃣ *برنامج الإحالات:* شارك رابطك واكسب 10 نقاط عن كل صديق يشاهد 10 إعلانات.\n` +
          `4️⃣ *إكمال مهام الشركاء:* متابعة قنوات والتفاعل معها للحصول على مكافآت فورية.\n\n` +
          `🔹 *شروط السحب:*\n` +
          `• الحد الأدنى للسحب: 0.1 TON فقط.\n` +
          `• رسوم السحب: 5% لشبكة TON.\n` +
          `• شرط الأهلية: إكمال 15 إعلاناً على الأقل.\n\n` +
          `📞 *الدعم الفني والمساعدة:* [@TVA_Support_Help](https://t.me/TVA_Support_Help)\n` +
          `إذا كان لديك أي استفسار أو واجهت مشكلة، تواصل معنا عبر المعرف أعلاه.`;
        btnLaunch = '🚀 ابدأ الآن';
        btnSupport = '💬 الدعم الفني';
      } else {
        helpText =
          `💡 *TVA TON Mining Bot Guide & FAQ:*\n\n` +
          `🔹 *How Does It Work?*\n` +
          `The ecosystem is driven by "Points" that define your daily mining hashrate:\n` +
          `• Each *1 Point = 0.0001 TON daily*.\n` +
          `• Claim accumulated earnings anytime to add them to your withdrawable balance.\n\n` +
          `🔹 *Ways to Earn Points:*\n` +
          `1️⃣ *Watch Ads:* In Tasks tab, watch up to 40 ads daily (+1 Point/ad).\n` +
          `2️⃣ *Mining Rigs:* Permanent lifetime upgrades granting up to 60,000+ points.\n` +
          `3️⃣ *Referrals:* Earn 10 points for every active friend who completes 10 ads.\n` +
          `4️⃣ *Partner Tasks:* Subscribe to partner channels for instant bonuses.\n\n` +
          `🔹 *Withdrawal Terms:*\n` +
          `• Minimum Withdrawal: 0.1 TON only.\n` +
          `• Network Fee: 5% TON network fee.\n` +
          `• Eligibility: Complete at least 15 daily ads.\n\n` +
          `📞 *Technical Support:* [@TVA_Support_Help](https://t.me/TVA_Support_Help)`;
        btnLaunch = '🚀 Launch App';
        btnSupport = '💬 Support';
      }

      await ctx.reply(helpText, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        ...Markup.inlineKeyboard([
          [Markup.button.webApp(btnLaunch, config.telegram.webAppUrl)],
          [Markup.button.url(btnSupport, 'https://t.me/TVA_Support_Help')],
        ]),
      });
    } catch (err) {
      console.error('Error handling /help command:', err);
    }
  });

  // Admin action callbacks for withdrawal requests
  botInstance.action(/^approve_withdrawal_(.+)$/, async (ctx) => {
    if (String(ctx.from.id) !== String(config.telegram.adminId)) {
      return ctx.answerCbQuery('غير مصرح لك بهذا الإجراء', { show_alert: true });
    }

    const requestId = ctx.match[1];
    try {
      const req = await WithdrawalRequest.findById(requestId);
      if (!req) return ctx.answerCbQuery('طلب السحب غير موجود');
      if (req.status !== 'pending') return ctx.answerCbQuery(`الحالة الحالية: ${req.status}`);

      req.status = 'approved';
      await req.save();

      // Post proof to @TVA_Payment channel
      try {
        const userDisplay = req.username ? `@${req.username}` : `ID: ${req.telegramId}`;
        const amountDisplay = `${req.netAmountTon || req.amountTon} TON`;
        const proofMessage = `✅ تم سحب ${amountDisplay} بنجاح للمستخدم ${userDisplay}!`;
        await ctx.telegram.sendMessage('@TVA_Payment', proofMessage).catch((e) => {
          console.warn('⚠️ Could not post proof to @TVA_Payment:', e.message);
        });
      } catch (_) {}

      await ctx.editMessageText(
        `${ctx.callbackQuery.message.text}\n\n✅ *الحالة: تم القبول بواسطة المسؤول (APPROVED)*`,
        { parse_mode: 'Markdown' }
      );
      await ctx.answerCbQuery('تم قبول طلب السحب بنجاح!');
    } catch (err) {
      ctx.answerCbQuery('خطأ: ' + err.message);
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
