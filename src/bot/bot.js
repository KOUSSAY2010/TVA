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

  // /start command with referral tracking
  botInstance.command('start', async (ctx) => {
    try {
      const text = ctx.message?.text || '';
      const parts = text.split(/\s+/);
      const payload = parts.length > 1 ? parts[1].trim() : '';
      let referrerId = null;

      if (payload.startsWith('ref_')) {
        const parsed = parseInt(payload.replace('ref_', ''), 10);
        if (!isNaN(parsed)) referrerId = parsed;
      } else if (!isNaN(parseInt(payload, 10)) && payload !== '') {
        referrerId = parseInt(payload, 10);
      }

      // Check if user exists or create new user with referrer ID
      const user = await MiningService.getOrCreateUser(ctx.from, referrerId);
      const currentRate = user.calculateDailyMiningRate();
      const botUsername = ctx.botInfo?.username || config.telegram.botUsername || 'TVAMining_bot';

      // Welcome message in Arabic introducing the TVA Mining platform
      const welcomeText =
        `⚡ *أهلاً بك في منصة TVA لتعدين TON!* ⚡\n\n` +
        `🚀 ابدأ الآن في تعدين عملة TON بشكل سحابي ومجاني، واربح المزيد يومياً من خلال:\n` +
        `• 📺 *مشاهدة الإعلانات:* اكسب +1 نقطة لكل إعلان تشاهده لزيادة سرعة التعدين\n` +
        `• 🤖 *منصات التعدين الآلية:* ترقيات دائمة مدى الحياة تمنحك آلاف النقاط\n` +
        `• 👥 *دعوة الأصدقاء:* اكسب 10 نقاط لكل صديق يصبح نشطاً\n\n` +
        `📊 *إحصائيات حسابك الحالية:*\n` +
        `• 💎 *رصيد المحفظة:* \`${user.tonBalance.toFixed(4)} TON\`\n` +
        `• ⚡ *معدل التعدين:* \`${currentRate} TON/يوم\`\n` +
        `• 🎯 *مجموع النقاط:* \`${user.totalPoints} نقطة\`\n` +
        `• 🤝 *الإحالات النشطة:* \`${user.activeReferralsCount}\`\n\n` +
        `💡 *ملاحظة:* 1 نقطة = 0.0001 TON / يومياً\n\n` +
        `اضغط على الزر أدناه لفتح التطبيق وبدء التعدين فوراً! 👇`;

      const shareText = encodeURIComponent('انضم إلى منصة TVA وابدأ في تعدين عملة TON يومياً مجاناً! 🚀💎');
      const shareUrl = `https://t.me/share/url?url=https://t.me/${botUsername}?start=ref_${ctx.from.id}&text=${shareText}`;

      // WebApp Launch Button
      const keyboard = Markup.inlineKeyboard([
        [
          Markup.button.webApp(
            '🚀 فتح التطبيق | Launch',
            config.telegram.webAppUrl
          ),
        ],
        [
          Markup.button.url(
            '👥 دعوة الأصدقاء | Invite',
            shareUrl
          ),
        ],
      ]);

      await ctx.reply(welcomeText, {
        parse_mode: 'Markdown',
        ...keyboard,
      });
    } catch (err) {
      console.error('Error handling /start command:', err);
      // Fallback message with WebApp button
      try {
        await ctx.reply('مرحباً بك في TVA! اضغط على الزر أدناه لفتح التطبيق:', {
          ...Markup.inlineKeyboard([
            [Markup.button.webApp('🚀 فتح التطبيق | Launch', config.telegram.webAppUrl)],
          ]),
        });
      } catch (_) {}
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
