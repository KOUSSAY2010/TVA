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

  // Register Bot commands in Telegram Menu
  try {
    botInstance.telegram.setMyCommands([
      { command: 'start', description: '🚀 ابدأ تشغيل البوت' },
      { command: 'app', description: '⚡ فتح تطبيق التعدين' },
      { command: 'help', description: '💡 تعليمات وطرق الكسب والدعم' },
    ]).catch((err) => {
      console.warn('⚠️ Could not register bot commands with Telegram:', err.message);
    });
  } catch (err) {
    console.warn('⚠️ setMyCommands error:', err.message);
  }

  // 1. /start command with referral tracking & professional welcome
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

      // Professional welcome message in Arabic introducing the TVA Mining platform
      const welcomeText =
        `⚡ *أهلاً بك في بوت TVA لتعدين TON السحابي!* ⚡\n\n` +
        `🚀 ابدأ الآن في تعدين عملة TON مجاناً وبأعلى سرعة ممكنة عبر تطبيقنا المصغر.\n\n` +
        `💎 *طرق كسب النقاط ومضاعفة سرعة التعدين:*\n` +
        `• 📺 *مشاهدة الإعلانات:* اكسب +1 نقطة لكل إعلان تشاهده يومياً.\n` +
        `• 🤖 *منصات التعدين الآلية:* ترقيات دائمة مدى الحياة تمنحك آلاف النقاط فوراً.\n` +
        `• 👥 *دعوة الأصدقاء:* اكسب 10 نقاط لكل صديق يصبح نشطاً.\n` +
        `• 📋 *المهام السريعة:* اشترك في قنواتنا وتابع شركاءنا واربح نقاطاً إضافية.\n\n` +
        `📊 *إحصائيات حسابك:*\n` +
        `• 💰 *رصيد TON:* \`${user.tonBalance.toFixed(4)} TON\`\n` +
        `• ⚡ *معدل التعدين:* \`${currentRate} TON/يوم\`\n` +
        `• 🎯 *مجموع النقاط:* \`${user.totalPoints} نقطة\`\n` +
        `• 🤝 *الإحالات النشطة:* \`${user.activeReferralsCount}\`\n\n` +
        `💡 *معادلة التحويل:* 1 نقطة = 0.0001 TON / يومياً\n\n` +
        `اضغط على زر *🚀 ابدأ الآن* أدناه للدخول إلى التطبيق وبدء التعدين! 👇`;

      const shareText = encodeURIComponent('انضم إلى منصة TVA وابدأ في تعدين عملة TON يومياً مجاناً! 🚀💎');
      const shareUrl = `https://t.me/share/url?url=https://t.me/${botUsername}?start=ref_${ctx.from.id}&text=${shareText}`;

      const keyboard = Markup.inlineKeyboard([
        [
          Markup.button.webApp(
            '🚀 ابدأ الآن',
            config.telegram.webAppUrl
          ),
        ],
        [
          Markup.button.url(
            '👥 دعوة الأصدقاء',
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
      try {
        await ctx.reply('مرحباً بك في بوت TVA! اضغط على الزر أدناه لفتح التطبيق:', {
          ...Markup.inlineKeyboard([
            [Markup.button.webApp('🚀 ابدأ الآن', config.telegram.webAppUrl)],
          ]),
        });
      } catch (_) {}
    }
  });

  // 2. /app command: Compact direct launcher
  botInstance.command('app', async (ctx) => {
    try {
      const appText =
        `🚀 *تطبيق TVA Mining جاهز للعمل!*\n\n` +
        `اضغط على الزر أدناه لفتح التطبيق ومتابعة أرباح التعدين، جمع العملات، وتنفيذ المهام اليومية:`;

      await ctx.reply(appText, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.webApp('🚀 ابدأ الآن', config.telegram.webAppUrl)],
        ]),
      });
    } catch (err) {
      console.error('Error handling /app command:', err);
    }
  });

  // 3. /help command: Instructions on earning points, rigs, and support contact
  botInstance.command('help', async (ctx) => {
    try {
      const helpText =
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

      await ctx.reply(helpText, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        ...Markup.inlineKeyboard([
          [Markup.button.webApp('🚀 ابدأ الآن', config.telegram.webAppUrl)],
          [Markup.button.url('💬 الدعم الفني', 'https://t.me/TVA_Support_Help')],
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
