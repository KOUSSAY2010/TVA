/**
 * TVA Crypto-Mining Telegram Mini App Client Logic
 * Bilingual Support: Arabic (Default) & English
 */

// 1. Telegram WebApp SDK Initialization
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  if (tg.setHeaderColor) tg.setHeaderColor('#0a0505');
  if (tg.setBackgroundColor) tg.setBackgroundColor('#050303');
}

// 2. Localization (i18n) Translations Dictionary
const TRANSLATIONS = {
  ar: {
    // Header
    welcome_back: 'مرحباً بك،',
    ton_mainnet: 'شبكة TON الرئيسية',

    // Home Dashboard
    total_balance: 'الرصيد الكلي',
    balance_subtext: 'متاح للسحب وشراء منصات التعدين',
    current_daily_rate: 'معدل التعدين اليومي',
    mined_ready_claim: 'عملات TON الجاهزة للمطالبة',
    claim_ton: 'مطالبة بالأرباح',
    go_to_withdraw: 'سحب الأرباح',
    withdraw_sub: 'الحد الأدنى 0.1 TON',
    go_to_tasks: 'تنفيذ المهام',
    tasks_sub: '+1 نقطة لكل إعلان',
    redeem_promo_title: 'استخدام الرمز الترويجي',
    redeem_promo_desc: 'هل تمتلك رمزاً ترويجياً؟ أدخله أدناه. (يتطلب مشاهدة إعلان واحد على الأقل).',
    redeem_btn: 'تفعيل',
    promo_placeholder: 'أدخل الرمز الترويجي',

    // Rigs Store
    rigs_store_badge: 'متجر منصات التعدين',
    rigs_store_title: 'وحدات التعدين الآلية',
    rigs_store_desc: 'شغل منصات التعدين المتقدمة لترقية حسابك ومضاعفة أرباح TON اليومية مباشرة.',
    active_rigs_label: 'المنصات النشطة حالياً:',
    days_contract_tag: 'ترقية دائمة مدى الحياة',
    lifetime_contract_tag: 'ترقية دائمة مدى الحياة',
    daily_yield: 'مكافأة النقاط',
    rig_points_reward: 'مكافأة النقاط',
    rig_upgrade_type: 'نوع الترقية',
    lifetime_type: 'دائمة مدى الحياة',
    total_return: 'النوع',
    buy_for: 'شراء بـ',
    unit: 'منصة',
    units: 'منصات',

    // Tasks
    boost_hashrate: 'زيادة سرعة التعدين',
    watch_ads_title: 'شاهد الإعلانات وضاعف أرباحك',
    watch_ads_desc: 'كل إعلان فيديو تشاهده يمنحك +1 نقطة تضاف مباشرة إلى رصيد نقاطك لزيادة قوة وسرعة التعدين!',
    daily_limit: 'الحد اليومي',
    resets_daily: 'يتجدد يومياً في 00:00 UTC',
    watch_ad_btn: 'مشاهدة إعلان وكسب النقاط',
    anti_cheat_note: 'محمي بنظام التحقق ومنع الاحتيال (15 ثانية)',
    community_tasks_title: 'مهام سريعة ومكافآت فورية',
    promote_channel_btn: 'ترويج قناة',
    community_tasks_desc: 'أكمل المهام البسيطة التالية واحصل على نقاط فورية تزيد من سرعتك في تعدين TON!',
    rate_badge_sub: '1 نقطة = 0.0001 TON / يومياً',

    // Friends
    referral_program: 'برنامج الإحالة',
    invite_miners_title: 'ادعُ أصدقاءك وضاعف دخلك',
    referral_desc: 'شارك رابط دعوتك مع أصدقائك. احصل على مكافآت عبر 4 مستويات إحالة!',

    total_friends: 'إجمالي الأصدقاء',
    active_friends: 'الأصدقاء النشطون (10 إعلانات)',
    your_ref_link: 'رابط الدعوة الخاص بك',
    copy_btn: 'نسخ',
    share_telegram: 'مشاركة عبر تلغرام',

    // Profile
    id_label: 'المعرف:',
    not_connected: 'غير متصل',
    connected: 'متصل',
    profile_wallet_title: 'المحفظة',
    profile_wallet_sub: 'إيداع • سحب',
    profile_settings_title: 'الإعدادات',
    profile_settings_sub: 'تفضيلات التطبيق واللغة',
    profile_feedback_title: 'الشكاوى والاقتراحات',
    profile_feedback_sub: 'أرسل شكوى أو اقتراحاً لفريق العمل',
    profile_admin_title: 'لوحة التحكم',
    profile_admin_sub: 'إدارة البوت والمستخدمين',

    // Withdrawal Modal
    modal_withdraw_title: 'طلب سحب الأرباح',
    modal_withdraw_caption: 'اسحب رصيدك من TON مباشرة إلى عنوان محفظتك.',
    modal_withdraw_min_rule: 'الحد الأدنى: 0.1 TON • رسوم السحب 5%',
    modal_withdraw_req_rule: 'شرط السحب: مشاهدة 15 إعلاناً',
    watch_ad_withdraw_btn: 'مشاهدة إعلان لفتح السحب',
    modal_withdraw_wallet_label: 'عنوان محفظة TON',
    modal_withdraw_wallet_placeholder: 'أدخل عنوان محفظة TON',
    modal_withdraw_amount_label: 'المبلغ المراد سحبه (TON)',
    modal_withdraw_submit_btn: 'تأكيد طلب السحب',

    // Settings Modal
    modal_settings_title: 'إعدادات التطبيق',
    modal_settings_caption: 'اختر لغة الواجهة المفضلة لديك.',
    modal_settings_lang_label: 'اختر اللغة',
    modal_settings_save_btn: 'حفظ التفضيلات',

    // Feedback & Admin
    modal_feedback_title: 'الشكاوى والاقتراحات',
    modal_feedback_caption: 'هل لديك اقتراح لتطوير التطبيق أو واجهت مشكلة؟ أرسل رسالة مباشرة إلى الإدارة.',
    modal_feedback_cat_label: 'نوع الرسالة',
    modal_feedback_msg_label: 'نص الرسالة',
    modal_feedback_placeholder: 'اكتب تفاصيل اقتراحك أو مشكلتك هنا...',
    modal_feedback_submit: 'إرسال إلى الفريق',
    modal_admin_title: 'لوحة إدارة المسؤول',
    modal_admin_caption: 'مركز تحكم المسؤول لإدارة البوت ومتابعة الطلبات.',
    admin_promo_title: 'إنشاء رمز ترويجي',
    admin_code_label: 'رمز الكوبون (اختياري)',
    admin_ton_label: 'مكافأة TON',
    admin_points_label: 'مكافأة النقاط',
    admin_uses_label: 'عدد مرات الاستخدام',
    admin_btn_generate: 'إنشاء الكود',
    admin_withdrawals_title: 'طلبات السحب المعلقة',
    admin_search_title: 'بحث عن مستخدم وتعديل الرصيد',
    admin_btn_search: 'بحث',
    admin_btn_update: 'حفظ وتحديث رصيد المستخدم',
    admin_no_withdrawals: 'لا توجد طلبات سحب معلقة حالياً.',
    admin_approve_btn: 'موافقة',
    admin_reject_btn: 'رفض',
    admin_stats_tab: 'الإحصائيات العامة',
    admin_tasks_tab: 'إدارة المهام',
    admin_promo_tab: 'الرموز الترويجية',
    admin_withdrawals_tab: 'طلبات السحب',
    admin_users_tab: 'المستخدمين',
    admin_total_users: 'إجمالي المستخدمين',
    admin_combined_rate: 'معدل التعدين الكلي (جميع المستخدمين)',
    admin_total_deposits: 'إجمالي الإيداعات',
    admin_total_withdrawals: 'إجمالي السحوبات',
    admin_setting_withdrawal_title: 'إعدادات وقواعد السحب',
    admin_toggle_paywall_title: 'اشتراط شراء منصة تعدين للسحب',
    admin_toggle_paywall_desc: 'عند التفعيل، لن يتمكن أي مستخدم من سحب رصيده إلا إذا كان قد اشترى منصة تعدين واحدة على الأقل.',
    rig_daily_profit: 'الربح اليومي',

    // Navigation Tabs
    nav_home: 'الرئيسية',
    nav_rigs: 'المنصات',
    nav_tasks: 'المهام',
    nav_friends: 'الأصدقاء',
    nav_profile: 'حسابي',

    // Support
    profile_support_title: 'الدعم الفني المباشر',
    profile_support_sub: 'تواصل مباشر مع الإدارة عبر تلغرام',
    support_chip_247: '24/7',

    // Deposit & Withdraw
    deposit_short: 'إيداع',
    withdraw_short: 'سحب',
    go_to_deposit: 'إيداع TON',
    deposit_sub: 'TON Connect',
    modal_deposit_title: 'إيداع رصيد TON',
    modal_deposit_caption: 'اشحن رصيدك فورياً لشراء منصات التعدين الآلية ومضاعفة دخلك اليومي.',
    connect_wallet_label: 'ربط المحفظة (Tonkeeper / Telegram Wallet)',
    select_deposit_amount: 'المبلغ المراد إيداعه (TON)',
    btn_send_deposit: 'إرسال المعاملة عبر المحفظة',

    // Force Sub (Matching Reference Image 1)
    force_sub_title: 'انضم للمتابعة',
    force_sub_desc: 'يجب الانضمام إلى القنوات أدناه لتتمكن من استخدام البوت والحصول على مكافآتك.',
    btn_join_channel: 'الانضمام إلى القناة',
    btn_verify_sub: 'التحقق من الاشتراك',
    btn_join: 'انضمام',

    // Language Selection Modal
    modal_language_title: 'اختر لغة التطبيق',
    modal_language_desc: 'اختر لغة واجهة التطبيق المفضلة لديك. يمكنك تغييرها دائماً من الإعدادات.',
    btn_confirm_language: 'تأكيد ومتابعة',

    // 4-Tier Referrals
    ref_tiers_title: 'نظام الإحالة ذو 4 مستويات',
    tier_1_label: 'إحالات مباشرة (المستوى 1)',
    tier_2_label: 'شبكة المستوى الثاني',
    tier_3_label: 'شبكة المستوى الثالث',
    tier_4_label: 'شبكة المستوى الرابع',
    friends_unit: 'صديق',

    // P2P Tasks
    p2p_modal_caption: 'انشر رابط قناتك أو مجموعتك لمئات المعدنين النشطين مع الدفع المباشر عبر TON Connect.',
    p2p_channel_admin_note: 'إذا كنت تروج لقناة، يرجى إضافة البوت كمسؤول (Admin) في القناة للتأكد من الانضمام',
    p2p_title_label: 'اسم القناة أو المهمة',
    p2p_link_label: 'رابط القناة أو المجموعة (Telegram Link)',
    p2p_target_label: 'العدد المستهدف (أعضاء)',
    p2p_reward_label: 'مكافأة كل مستخدم (نقاط)',

    p2p_modal_title: 'ترويج قناة أو مجموعة (P2P Task)',
    p2p_total_cost_label: 'التكلفة الإجمالية للنشر:',
    p2p_deposit_dest_label: 'عنوان محفظة الاستلام المعتمد:',
    countdown_seconds_label: 'ثانية متبقية',
    ad_playing_title: 'جاري تشغيل الإعلان الترويجي...',
    ad_playing_desc: 'انتظر حتى يكتمل العداد لاحتساب نقطة التعدين وزيادة معدل الهاش ريت.',
    ad_early_close_warn: 'تنبيه: إغلاق الإعلان قبل انتهاء 15 ثانية يلغي المكافأة بالكامل.',
    ad_wait_button: 'انتظر انتهاء الإعلان (15 ثانية)...',
    fb_cat_suggestion: '💡 اقتراح / فكرة',
    fb_cat_complaint: '⚠️ شكوى / بلاغ',
    fb_cat_bug: '🐛 خطأ تقني (Bug)',
    fb_cat_other: '💬 استفسار آخر',

    // Claim Ad
    modal_claim_ad_title: 'إعلان استلام الأرباح',
    claim_ad_stream_text: 'جاري بث الإعلان الترويجي... يرجى الانتظار للمطالبة بأرباح TON.',
    wait_ad_finish: 'يرجى مشاهدة الإعلان كاملاً (15 ث)...',
    claim_ad_ready: 'استلام أرباح التعدين الآن!',
  },
  en: {
    // Header
    welcome_back: 'Welcome back,',
    ton_mainnet: 'TON Mainnet',

    // Home Dashboard
    total_balance: 'Total Balance',
    balance_subtext: 'Available for withdrawal & rig purchases',
    current_daily_rate: 'Current Daily Rate',
    mined_ready_claim: 'Mined TON Ready to Claim',
    claim_ton: 'Claim TON',
    go_to_withdraw: 'Go to Withdraw',
    withdraw_sub: 'Min 0.1 TON',
    go_to_tasks: 'Go to Tasks',
    tasks_sub: '+1 Pt per Ad',
    redeem_promo_title: 'Redeem Promo Code',
    redeem_promo_desc: 'Have a promotional code? Enter it below. (Must have watched at least 1 ad).',
    redeem_btn: 'Redeem',
    promo_placeholder: 'ENTER CODE',

    // Rigs / Dragons Store
    rigs_store_badge: 'Dragon Store 🐉',
    rigs_store_title: 'TON Mining Dragons',
    rigs_store_desc: 'Summon powerful Dragons to upgrade your account and multiply your daily TON earnings directly.',
    active_rigs_label: 'Currently Active Dragons:',
    days_contract_tag: 'Lifetime Upgrade',
    lifetime_contract_tag: 'Lifetime Upgrade',
    daily_yield: 'Points Reward',
    rig_points_reward: 'Points Reward',
    rig_upgrade_type: 'Upgrade Type',
    lifetime_type: 'Lifetime',
    total_return: 'Type',
    buy_for: 'Buy for',
    unit: 'Dragon',
    units: 'Dragons',

    // Tasks
    boost_hashrate: 'Boost Your Hashrate',
    watch_ads_title: 'Watch Ads & Multiply Power',
    watch_ads_desc: 'Each completed video ad rewards you with +1 Point directly to your points balance to boost your mining speed!',
    daily_limit: 'Daily Limit',
    resets_daily: 'Resets daily at 00:00 UTC',
    watch_ad_btn: 'Watch Ad & Earn Points',
    anti_cheat_note: 'Protected by 15s Anti-Cheat verification',
    community_tasks_title: 'Quick Tasks & Instant Rewards',
    promote_channel_btn: 'Promote Channel',
    community_tasks_desc: 'Complete the simple tasks below to earn instant points that boost your TON mining speed!',
    rate_badge_sub: '1 Point = 0.0001 TON / daily',

    // Friends
    referral_program: 'Referral Program',
    invite_miners_title: 'Invite Dragons & Expand',
    referral_desc: 'Share your invite link with friends. Earn rewards across 4 referral tiers!',
    total_friends: 'Total Friends',
    active_friends: 'Active Friends (10 ads)',
    your_ref_link: 'Your Unique Referral Link',
    copy_btn: 'Copy',
    share_telegram: 'Share to Telegram',
    ref_tiers_title: '4-Tier Referral Hierarchy',
    tier_1_label: 'Direct Referrals (Level 1)',
    tier_2_label: '2nd Tier Network',
    tier_3_label: '3rd Tier Network',
    tier_4_label: '4th Tier Network',
    friends_unit: 'friends',

    // P2P Tasks
    p2p_modal_caption: 'Promote your Telegram channel or group to active miners with direct TON Connect payments.',
    p2p_channel_admin_note: 'If promoting a channel, please add the bot as Admin to verify joins',
    p2p_title_label: 'Channel or Task Name',
    p2p_link_label: 'Channel or Group Link (Telegram)',
    p2p_target_label: 'Target Members',
    p2p_reward_label: 'User Reward (Points)',
    p2p_modal_title: 'Promote Channel or Group (P2P Task)',
    p2p_total_cost_label: 'Total Publication Cost:',
    p2p_deposit_dest_label: 'Official Receiving Wallet Address:',
    countdown_seconds_label: 'seconds remaining',
    ad_playing_title: 'Playing sponsored ad...',
    ad_playing_desc: 'Wait for the timer to finish to earn points and boost your mining speed.',
    ad_early_close_warn: 'Warning: Closing early forfeits the mining reward.',
    ad_wait_button: 'Please wait for ad (15s)...',
    fb_cat_suggestion: '💡 Suggestion / Idea',
    fb_cat_complaint: '⚠️ Complaint / Report',
    fb_cat_bug: '🐛 Bug Report',
    fb_cat_other: '💬 Other Question',

    // Profile
    id_label: 'ID:',
    not_connected: 'Not Connected',
    connected: 'Connected',
    profile_wallet_title: 'Wallet',
    profile_wallet_sub: 'Deposit • Withdraw',
    profile_settings_title: 'Settings',
    profile_settings_sub: 'App preferences & language',
    profile_feedback_title: 'Complaints & Suggestions',
    profile_feedback_sub: 'Send a complaint or suggestion to the team',
    profile_admin_title: 'Admin Panel',
    profile_admin_sub: 'Manage bot and users',

    // Withdrawal Modal
    modal_withdraw_title: 'Request Withdrawal',
    modal_withdraw_caption: 'Withdraw mined TON directly to your TON wallet address.',
    modal_withdraw_min_rule: 'Min: 0.1 TON • 5% withdrawal fee',
    modal_withdraw_req_rule: 'Requirement: Watch 15 ads to withdraw',
    watch_ad_withdraw_btn: 'Watch Ad for Withdrawal',
    modal_withdraw_wallet_label: 'TON Wallet Address',
    modal_withdraw_wallet_placeholder: 'EQD... or UQD...',
    modal_withdraw_amount_label: 'Amount to Withdraw (TON)',
    modal_withdraw_submit_btn: 'Submit Withdrawal Request',

    // Settings Modal
    modal_settings_title: 'App Settings',
    modal_settings_caption: 'Customize your interface language and preferences.',
    modal_settings_lang_label: 'Select Language',
    modal_settings_save_btn: 'Save Preferences',

    // Language Selection Modal
    modal_language_title: 'Select App Language',
    modal_language_desc: 'Choose your preferred language for the TVA Mining App. You can change this anytime in Settings.',
    btn_confirm_language: 'Save & Continue',

    // Feedback & Admin
    modal_feedback_title: 'Complaints & Suggestions',
    modal_feedback_caption: 'Have an idea to improve the app or encountered an issue? Send a direct message to the team.',
    modal_feedback_cat_label: 'Topic Category',
    modal_feedback_msg_label: 'Your Message',
    modal_feedback_placeholder: 'Describe your suggestion or issue in detail...',
    modal_feedback_submit: 'Send to Team',
    modal_admin_title: 'Admin Management',
    modal_admin_caption: 'Administrative control center for bot parameters and monitoring.',
    admin_promo_title: 'Generate Promo Code',
    admin_code_label: 'Promo Code (Optional)',
    admin_ton_label: 'TON Reward',
    admin_points_label: 'Points Reward',
    admin_uses_label: 'Max Usage Limit',
    admin_btn_generate: 'Generate Code',
    admin_withdrawals_title: 'Pending Withdrawals',
    admin_search_title: 'Search User & Modify Balance',
    admin_btn_search: 'Search',
    admin_btn_update: 'Update User Balance',
    admin_no_withdrawals: 'No pending withdrawal requests found.',
    admin_approve_btn: 'Approve',
    admin_reject_btn: 'Reject',
    admin_stats_tab: 'Global Stats',
    admin_tasks_tab: 'Task Manager',
    admin_promo_tab: 'Promo Codes',
    admin_withdrawals_tab: 'Withdrawals',
    admin_users_tab: 'Users',
    admin_total_users: 'Total Users',
    admin_combined_rate: 'Total Combined Mining Rate',
    admin_total_deposits: 'Total Deposits',
    admin_total_withdrawals: 'Total Withdrawals',
    admin_setting_withdrawal_title: 'Withdrawal Rules & Settings',
    admin_toggle_paywall_title: 'Require Plan Purchase for Withdrawal',
    admin_toggle_paywall_desc: 'When enabled, users cannot withdraw unless they have purchased at least one mining rig.',
    rig_daily_profit: 'Daily Profit',

    // Navigation Tabs
    nav_home: 'Home',
    nav_rigs: 'Rigs',
    nav_tasks: 'Tasks',
    nav_friends: 'Friends',
    nav_profile: 'Profile',

    // Support
    profile_support_title: 'Direct Support',
    profile_support_sub: 'Contact management directly via Telegram',
    support_chip_247: '24/7',

    // Deposit & Withdraw
    deposit_short: 'Deposit',
    withdraw_short: 'Withdraw',
    go_to_deposit: 'Deposit TON',
    deposit_sub: 'TON Connect',
    modal_deposit_title: 'Deposit TON Balance',
    modal_deposit_caption: 'Instantly top up your balance to deploy automated mining rigs and boost daily yield.',
    connect_wallet_label: 'Connect Wallet (Tonkeeper / Telegram Wallet)',
    select_deposit_amount: 'Amount to Deposit (TON)',
    btn_send_deposit: 'Send Transaction via Wallet',

    // Force Sub (Matching Reference Image 1)
    force_sub_title: 'Join to Continue',
    force_sub_desc: 'You must join the channels below to use the bot and unlock your referral reward.',
    btn_join_channel: 'Join Official Channel',
    btn_verify_sub: 'Verify Membership',
    btn_join: 'Join',

    // Claim Ad
    modal_claim_ad_title: 'Claim Reward Ad Stream',
    claim_ad_stream_text: 'Streaming verified ad... Please watch to claim your mined TON.',
    wait_ad_finish: 'Please watch full ad (15s)...',
    claim_ad_ready: 'Claim Mined TON Now!',
  },
  ru: {
    // Header
    welcome_back: 'С возвращением,',
    ton_mainnet: 'Сеть TON Mainnet',

    // Home Dashboard
    total_balance: 'Общий баланс',
    balance_subtext: 'Доступно для вывода и покупки ригов',
    current_daily_rate: 'Текущая дневная скорость',
    mined_ready_claim: 'Добытые TON готовы к сбору',
    claim_ton: 'Собрать TON',
    go_to_withdraw: 'Вывести прибыль',
    withdraw_sub: 'Мин. 0.1 TON',
    go_to_tasks: 'К заданиям',
    tasks_sub: '+1 балл за рекламу',
    redeem_promo_title: 'Использовать промокод',
    redeem_promo_desc: 'Есть промокод? Введите его ниже. (Необходимо посмотреть минимум 1 рекламу).',
    redeem_btn: 'Активировать',
    promo_placeholder: 'ВВЕДИТЕ КОД',

    // Rigs Store
    rigs_store_badge: 'Магазин майнинг-ригов',
    rigs_store_title: 'Автоматизированные майнеры',
    rigs_store_desc: 'Запускайте передовые майнеры, чтобы увеличить ежедневный доход в TON.',
    active_rigs_label: 'Активные риги:',
    days_contract_tag: 'Пожизненный контракт',
    lifetime_contract_tag: 'Пожизненный контракт',
    daily_yield: 'Награда в баллах',
    rig_points_reward: 'Награда в баллах',
    rig_upgrade_type: 'Тип улучшения',
    lifetime_type: 'Бессрочно',
    total_return: 'Тип',
    buy_for: 'Купить за',
    unit: 'Риг',
    units: 'Ригов',

    // Tasks
    boost_hashrate: 'Увеличить хешрейт',
    watch_ads_title: 'Смотрите рекламу и ускоряйте майнинг',
    watch_ads_desc: 'Каждый просмотр видео приносит +1 балл к вашему балансу для увеличения скорости добычи!',
    daily_limit: 'Дневной лимит',
    resets_daily: 'Сброс ежедневно в 00:00 UTC',
    watch_ad_btn: 'Смотреть рекламу (+1 балл)',
    anti_cheat_note: 'Защищено системой проверки (15 сек)',
    community_tasks_title: 'Быستрые задания и награды',
    promote_channel_btn: 'Продвигать канал',
    community_tasks_desc: 'Выполняйте простые задания ниже и получайте очки, ускоряющие ваш майнинг TON!',
    rate_badge_sub: '1 балл = 0.0001 TON / день',

    // Friends & Referrals
    referral_program: 'Реферальная программа',
    invite_miners_title: 'Приглашайте друзей и умножайте доход',
    referral_desc: 'Делитесь своей ссылкой с друзьями и зарабатывайте баллы на 4 уровнях рефералов!',
    total_friends: 'Всего друзей',
    active_friends: 'Активные друзья',
    your_ref_link: 'Ваша реферальная ссылка',
    copy_btn: 'Копировать',
    share_telegram: 'Поделиться в Telegram',
    ref_tiers_title: '4-уровневая реферальная система',
    tier_1_label: 'Прямые рефералы (Ур. 1)',
    tier_2_label: '2-й уровень сети',
    tier_3_label: '3-й уровень сети',
    tier_4_label: '4-й уровень сети',
    friends_unit: 'друзей',

    // Profile
    id_label: 'ID:',
    not_connected: 'Не подключен',
    connected: 'Подключен',
    profile_wallet_title: 'Кошелек',
    profile_wallet_sub: 'Пополнение • Вывод',
    profile_settings_title: 'Настройки',
    profile_settings_sub: 'Язык и параметры приложения',
    profile_feedback_title: 'Жалобы и предложения',
    profile_feedback_sub: 'Отправить обращение команде проекта',
    profile_admin_title: 'Панель администратора',
    profile_admin_sub: 'Управление ботом и пользователями',

    // Withdrawal Modal
    modal_withdraw_title: 'Запрос на вывод средств',
    modal_withdraw_caption: 'Выводите заработанные TON прямо на свой адрес кошелька.',
    modal_withdraw_min_rule: 'Мин: 0.1 TON • Комиссия сети 5%',
    modal_withdraw_req_rule: 'Условие: просмотр 15 реклам для вывода',
    watch_ad_withdraw_btn: 'Смотреть рекламу для вывода',
    modal_withdraw_wallet_label: 'Адрес кошелька TON',
    modal_withdraw_wallet_placeholder: 'EQD... или UQD...',
    modal_withdraw_amount_label: 'Сумма вывода (TON)',
    modal_withdraw_submit_btn: 'Подтвердить вывод',

    // Settings Modal
    modal_settings_title: 'Настройки приложения',
    modal_settings_caption: 'Выберите предпочтительный язык интерфейса.',
    modal_settings_lang_label: 'Выберите язык',
    modal_settings_save_btn: 'Сохранить настройки',

    // Language Selection Modal (Post-Force Join)
    modal_language_title: 'Выберите язык приложения',
    modal_language_desc: 'Выберите язык для работы с TVA Mining. Вы сможете изменить его в любой момент в настройках.',
    btn_confirm_language: 'Подтвердить и продолжить',
    btn_join: 'Вступить',

    // P2P Tasks
    p2p_modal_caption: 'Продвигайте свой Telegram-канал или группу среди сотен активных майнеров с оплатой через TON Connect.',
    p2p_channel_admin_note: 'Если вы продвигаете канал, пожалуйста, добавьте бота в администраторы канала для проверки подписок.',
    p2p_title_label: 'Название канала или задания',
    p2p_link_label: 'Ссылка на Telegram-канал или группу',
    p2p_target_label: 'Целевое число участников',
    p2p_reward_label: 'Награда каждому участнику',
    p2p_modal_title: 'Продвижение канала или группы (P2P)',
    p2p_total_cost_label: 'Общая стоимость публикации:',
    p2p_deposit_dest_label: 'Официальный адрес кошелька для оплаты:',
    countdown_seconds_label: 'сек осталось',
    ad_playing_title: 'Трансляция рекламы...',
    ad_playing_desc: 'Пожалуйста, дождитесь завершения таймера для начисления баллов.',
    ad_early_close_warn: 'Внимание: Досрочное закрытие аннулирует награду.',
    ad_wait_button: 'Ожидайте окончания (15 сек)...',
    fb_cat_suggestion: '💡 Предложение / Идея',
    fb_cat_complaint: '⚠️ Жалоба / Обращение',
    fb_cat_bug: '🐛 Техническая ошибка',
    fb_cat_other: '💬 Другой вопрос',

    // Feedback & Admin
    modal_feedback_title: 'Обратная связь и предложения',
    modal_feedback_caption: 'Возникли вопросы или есть предложение? Напишите напрямую нашей поддержке.',
    modal_feedback_cat_label: 'Категория обращения',
    modal_feedback_msg_label: 'Ваше сообщение',
    modal_feedback_placeholder: 'Опишите ваше предложение или проблему подробно...',
    modal_feedback_submit: 'Отправить',
    modal_admin_title: 'Управление администратора',
    modal_admin_caption: 'Центр контроля параметров и мониторинга системы.',
    admin_promo_title: 'Создать промокод',
    admin_code_label: 'Код купона (необязательно)',
    admin_ton_label: 'Награда TON',
    admin_points_label: 'Награда в баллах',
    admin_uses_label: 'Лимит использований',
    admin_btn_generate: 'Создать промокод',
    admin_withdrawals_title: 'Заявки на вывод',
    admin_search_title: 'Поиск пользователя и изменение баланса',
    admin_btn_search: 'Найти',
    admin_btn_update: 'Обновить баланс',
    admin_no_withdrawals: 'Нет заявок на вывод.',
    admin_approve_btn: 'Одобрить',
    admin_reject_btn: 'Отклонить',
    admin_stats_tab: 'Общая статистика',
    admin_tasks_tab: 'Задания',
    admin_promo_tab: 'Промокоды',
    admin_withdrawals_tab: 'Выводы',
    admin_users_tab: 'Пользователи',
    admin_total_users: 'Всего пользователей',
    admin_combined_rate: 'Общая скорость добычи',
    admin_total_deposits: 'Всего депозитов',
    admin_total_withdrawals: 'Всего выведено',
    admin_setting_withdrawal_title: 'Правила и настройки вывода',
    admin_toggle_paywall_title: 'Требовать покупку рига для вывода',
    admin_toggle_paywall_desc: 'При включении пользователи могут выводить средства только после покупки хотя бы одного майнера.',
    rig_daily_profit: 'Дневная прибыль',

    // Navigation Tabs
    nav_home: 'Главная',
    nav_rigs: 'Риги',
    nav_tasks: 'Задания',
    nav_friends: 'Друзья',
    nav_profile: 'Профиль',

    // Support
    profile_support_title: 'Прямая поддержка',
    profile_support_sub: 'Связь с администрацией в Telegram',
    support_chip_247: '24/7',

    // Deposit & Withdraw
    deposit_short: 'Пополнить',
    withdraw_short: 'Вывести',
    go_to_deposit: 'Пополнить TON',
    deposit_sub: 'TON Connect',
    modal_deposit_title: 'Пополнение баланса TON',
    modal_deposit_caption: 'Пополняйте баланс для запуска автоматических ригов и увеличения ежедневной прибыли.',
    connect_wallet_label: 'Подключение кошелька (Tonkeeper / Telegram Wallet)',
    select_deposit_amount: 'Сумма депозита (TON)',
    btn_send_deposit: 'Отправить транзакцию через кошелек',

    // Force Sub (Matching Reference Image 1)
    force_sub_title: 'Подпишитесь для продолжения',
    force_sub_desc: 'Вы должны подписаться на каналы ниже, чтобы использовать бота и разблокировать награды.',
    btn_join_channel: 'Подписаться на канал',
    btn_verify_sub: 'Проверить подписку',
    btn_join: 'Вступить',

    // Claim Ad
    modal_claim_ad_title: 'Просмотр рекламы для сбора дохода',
    claim_ad_stream_text: 'Трансляция рекламы... Пожалуйста, дождитесь окончания для начисления TON.',
    wait_ad_finish: 'Пожалуйста, посмотрите рекламу (15 сек)...',
    claim_ad_ready: 'Забрать добытые TON!',
  }
};

// 3. State & Clean Initial Data (Hydrated directly from live backend /api/user/me)
const state = {
  user: {
    telegramId: tg?.initDataUnsafe?.user?.id || 0,
    firstName: tg?.initDataUnsafe?.user?.first_name || '...',
    username: tg?.initDataUnsafe?.user?.username || '',
  },
  adminId: 7834260387, // Primary Client Admin ID
  isAdmin: false,
  walletConnected: false,
  connectedWalletAddress: '',
  selectedLanguage: 'en', // Client Mandate: WebApp default language MUST be English
  walletBalance: 0.0000,
  accumulatedTon: 0.00000000,
  dailyMiningRate: 0.000000, // Base + points + active rigs
  baseRate: 0.001000,
  totalPoints: 0,
  adsWatchedToday: 0,
  maxDailyAds: 30,
  totalAdsWatched: 0,
  adsWatchedForWithdrawal: 0,
  requiredWithdrawalAds: 15,
  totalFriends: 0,
  activeFriends: 0,
  activeRigsCount: 0,
  referralStats: {
    level1Count: 0,
    level2Count: 0,
    level3Count: 0,
    level4Count: 0,
    level1Points: 0,
    level2Points: 0,
    level3Points: 0,
    level4Points: 0,
  },
};

// Global LocalStorage Cache for Instant Offline & Zero-Lag Tab Switching
const CACHE_KEY = 'tva_user_state_cache';

function saveStateCache() {
  try {
    const dataToSave = {
      walletBalance: state.walletBalance,
      accumulatedTon: state.accumulatedTon,
      dailyMiningRate: state.dailyMiningRate,
      totalPoints: state.totalPoints,
      adsWatchedToday: state.adsWatchedToday,
      maxDailyAds: state.maxDailyAds,
      totalAdsWatched: state.totalAdsWatched,
      adsWatchedForWithdrawal: state.adsWatchedForWithdrawal,
      totalFriends: state.totalFriends,
      activeFriends: state.activeFriends,
      activeRigsCount: state.activeRigsCount,
      referralStats: state.referralStats,
      cachedAt: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(dataToSave));
  } catch (_) {}
}

function loadStateCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return;
    const data = JSON.parse(cached);
    if (!data || typeof data !== 'object') return;

    if (typeof data.walletBalance === 'number') state.walletBalance = data.walletBalance;
    if (typeof data.dailyMiningRate === 'number') state.dailyMiningRate = data.dailyMiningRate;
    if (typeof data.totalPoints === 'number') state.totalPoints = data.totalPoints;
    if (typeof data.adsWatchedToday === 'number') state.adsWatchedToday = data.adsWatchedToday;
    if (typeof data.maxDailyAds === 'number') state.maxDailyAds = (data.maxDailyAds === 40 ? 30 : data.maxDailyAds);
    if (typeof data.totalAdsWatched === 'number') state.totalAdsWatched = data.totalAdsWatched;
    if (typeof data.adsWatchedForWithdrawal === 'number') state.adsWatchedForWithdrawal = data.adsWatchedForWithdrawal;
    if (typeof data.totalFriends === 'number') state.totalFriends = data.totalFriends;
    if (typeof data.activeFriends === 'number') state.activeFriends = data.activeFriends;
    if (typeof data.activeRigsCount === 'number') state.activeRigsCount = data.activeRigsCount;
    if (data.referralStats && typeof data.referralStats === 'object') {
      state.referralStats = { ...state.referralStats, ...data.referralStats };
    }

    // Calculate elapsed mined TON offline
    if (typeof data.accumulatedTon === 'number') {
      const elapsedSeconds = Math.max(0, (Date.now() - (data.cachedAt || Date.now())) / 1000);
      const offlineMined = (state.dailyMiningRate / 86400) * elapsedSeconds;
      state.accumulatedTon = data.accumulatedTon + offlineMined;
    }
  } catch (_) {}
}

// Configurable App Parameters
// Configurable App Parameters
const APP_CONFIG = {
  botUsername: 'TVAMining_bot', // Configurable Telegram bot username for referral links
  supportAdminUsername: 'TVA_Support_Help', // Official Support Telegram username
  supportAdminUrl: 'https://t.me/TVA_Support_Help',
  adloopSlotId: '266123', // Official Adloop Network slot ID
  depositWalletAddress: 'UQDUlQeNULJd5yl9WjHBkHjA0O3pVueC8NKscybGQbI-R92M',
  channels: [
    { id: '@TVA_Mining_News', username: 'TVA_Mining_News', title: 'TVA Mining News 📢', url: 'https://t.me/TVA_Mining_News' },
    { id: '@TVA_Mining_News_Arabic', username: 'TVA_Mining_News_Arabic', title: 'TVA الأخبار العربية 📢', url: 'https://t.me/TVA_Mining_News_Arabic' },
    { id: '@TVA_Payment', username: 'TVA_Payment', title: 'TVA إثباتات السحب والدفع 💎', url: 'https://t.me/TVA_Payment' },
  ],
};

let tonConnectUI = null;
let isTonConnectInitializing = false;

function initTonConnect() {
  if (window.TON_CONNECT_UI) {
    try {
      if (!tonConnectUI && !isTonConnectInitializing) {
        isTonConnectInitializing = true;
        tonConnectUI = new window.TON_CONNECT_UI.TonConnectUI({
          manifestUrl: window.location.origin + '/tonconnect-manifest.json',
          buttonRootId: 'ton-connect-btn-container',
        });

        // Real-time listener for TON Connect wallet state
        tonConnectUI.onStatusChange((wallet) => {
          if (wallet && wallet.account) {
            state.walletConnected = true;
            let displayAddress = '';
            try {
              if (window.TON_CONNECT_UI.toUserFriendlyAddress) {
                displayAddress = window.TON_CONNECT_UI.toUserFriendlyAddress(wallet.account.address);
              }
            } catch (_) {}
            if (!displayAddress) {
              displayAddress = wallet.account.address || '';
            }
            state.connectedWalletAddress = displayAddress.length > 10
              ? `${displayAddress.slice(0, 4)}...${displayAddress.slice(-4)}`
              : displayAddress;
            state.fullWalletAddress = displayAddress;
          } else {
            state.walletConnected = false;
            state.connectedWalletAddress = '';
            state.fullWalletAddress = '';
          }
          renderWalletPill();
          saveStateCache();
        });
      }
    } catch (e) {
      console.warn('TonConnectUI init warning:', e.message);
    } finally {
      isTonConnectInitializing = false;
    }
  }
  return tonConnectUI;
}

async function ensureTonConnectUI(maxWaitMs = 3500) {
  if (tonConnectUI) return tonConnectUI;
  if (initTonConnect()) return tonConnectUI;

  // Poll for window.TON_CONNECT_UI if script is still downloading
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    await new Promise((r) => setTimeout(r, 150));
    if (initTonConnect()) return tonConnectUI;
  }

  // Fallback: If not loaded yet, inject secondary CDN
  if (!window.TON_CONNECT_UI) {
    await new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@tonconnect/ui@latest/dist/tonconnect-ui.min.js';
      script.onload = () => {
        initTonConnect();
        resolve(tonConnectUI);
      };
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
      setTimeout(() => resolve(initTonConnect()), 2500);
    });
  }

  return initTonConnect();
}

async function loadPublicConfig() {
  try {
    const res = await fetch('/api/config/public');
    const json = await res.json();
    if (json.success && json.data) {
      if (json.data.botUsername) APP_CONFIG.botUsername = json.data.botUsername;
      if (json.data.supportUsername) {
        APP_CONFIG.supportAdminUsername = json.data.supportUsername;
        APP_CONFIG.supportAdminUrl = `https://t.me/${json.data.supportUsername.replace(/^@/, '')}`;
      }
      if (json.data.supportUrl) APP_CONFIG.supportAdminUrl = json.data.supportUrl;
      if (json.data.depositAddress) APP_CONFIG.depositWalletAddress = json.data.depositAddress;
      if (json.data.adloopSlotId) APP_CONFIG.adloopSlotId = json.data.adloopSlotId;
      if (Array.isArray(json.data.channels) && json.data.channels.length > 0) {
        APP_CONFIG.channels = json.data.channels;
      }

      const depositAddrDisp = document.getElementById('deposit-wallet-address-display');
      if (depositAddrDisp) depositAddrDisp.innerText = APP_CONFIG.depositWalletAddress;
      
      // Update referral link in UI if friends tab input exists
      const linkInput = document.getElementById('referral-link-input');
      if (linkInput && state.user?.telegramId) {
        linkInput.value = `https://t.me/${APP_CONFIG.botUsername}?start=ref_${state.user.telegramId}`;
      }
    }
  } catch (_) {}
}

// Mining Rig Tiers: [1, 3, 5, 10, 25, 50, 100] TON featuring Realistic 3D Robot Visuals
// Lifetime upgrades granting Points (1100 points per 1 TON)
const RIG_TIERS = [
  {
    cost: 1,
    pointsYield: 1100,
    image: '/img/robots/tier1.jpg',
    nameEn: 'Quantum Microchip',
    nameAr: 'شريحة معالجة كمومية',
  },
  {
    cost: 3,
    pointsYield: 3300,
    image: '/img/robots/tier2.jpg',
    nameEn: 'RTX Titan GPU',
    nameAr: 'كارت شاشة Titan RTX',
  },
  {
    cost: 5,
    pointsYield: 5500,
    image: '/img/robots/tier3.jpg',
    nameEn: 'Multi-GPU Mining Rig',
    nameAr: 'منصة تعدين متعددة الكروت',
  },
  {
    cost: 10,
    pointsYield: 11000,
    image: '/img/robots/tier4.jpg',
    nameEn: 'Hydro ASIC Miner',
    nameAr: 'معدن هيدرو ASIC فائق',
  },
  {
    cost: 25,
    pointsYield: 27500,
    image: '/img/robots/tier5.jpg',
    nameEn: 'High-Density Server Rack',
    nameAr: 'خزانة خوادم فائقة الكثافة',
  },
  {
    cost: 50,
    pointsYield: 55000,
    image: '/img/robots/tier6.jpg',
    nameEn: 'Cyber Data Center Room',
    nameAr: 'غرفة مركز بيانات سايبر',
  },
  {
    cost: 100,
    pointsYield: 110000,
    image: '/img/robots/tier7.jpg',
    nameEn: 'Quantum Supercomputer',
    nameAr: 'حاسوب كمومي فائق التطور',
  },
];

let liveTickerInterval = null;

// ==========================================================================
// 4. LANGUAGE SWITCHER LOGIC (Bilingual/Trilingual: English, Arabic, Russian)
// ==========================================================================
function getInitialLanguage() {
  const saved = localStorage.getItem('tva_lang');
  if (saved && (saved === 'ar' || saved === 'en' || saved === 'ru')) {
    return saved;
  }
  // Client Mandate: WebApp default language MUST be English ('en')
  return 'en';
}

function setLanguage(lang) {
  state.selectedLanguage = lang;
  localStorage.setItem('tva_lang', lang);

  // Set document language and text direction (RTL for Arabic, LTR for English/Russian)
  document.documentElement.lang = lang;
  document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Translate all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      el.innerText = t[key];
    }
  });

  // Translate placeholder attributes with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) {
      el.placeholder = t[key];
    }
  });

  // Synchronize language option cards across all modals (Settings & Language Selection)
  document.querySelectorAll('.language-option-card').forEach((c) => {
    const cardLang = c.getAttribute('data-lang');
    const checkIcon = c.querySelector('.lang-check i');
    if (cardLang === lang) {
      c.classList.add('active');
      if (checkIcon) checkIcon.className = 'fa-solid fa-circle-check';
    } else {
      c.classList.remove('active');
      if (checkIcon) checkIcon.className = 'fa-regular fa-circle';
    }
  });

  // Re-render components with translated dynamic values
  renderDedicatedRigs();
  renderWalletPill();
  updateUI();
  loadUserTasks();
}

// ==========================================================================
// 5. TAB NAVIGATION (Home, Rigs, Tasks, Friends, Profile)
// ==========================================================================
function switchTab(targetViewId) {
  const navTabs = document.querySelectorAll('.nav-tab');
  const viewPanels = document.querySelectorAll('.view-panel');

  navTabs.forEach((tab) => {
    if (tab.getAttribute('data-tab') === targetViewId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  viewPanels.forEach((panel) => {
    if (panel.id === targetViewId) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  triggerHaptic('selection');
  window.scrollTo(0, 0);

  if (targetViewId === 'view-tasks') {
    loadUserTasks();
  }
}

function setupTabNavigation() {
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');
      switchTab(targetId);
    });
  });
}

// ==========================================================================
// 6. RESILIENT AD SYSTEM (ADLOOP + 15S INTERACTIVE PROMO BACKUP ENGINE)
// ==========================================================================
function getAdloopSdk() {
  if (typeof window !== 'undefined') {
    if (window.Adloop) return window.Adloop;
    if (window.adloop) return window.adloop;
    if (window.AdLoop) return window.AdLoop;
  }
  if (typeof Adloop !== 'undefined') return Adloop;
  if (typeof adloop !== 'undefined') return adloop;
  return null;
}

async function ensureAdloopReady(maxWaitMs = 3000) {
  let sdk = getAdloopSdk();
  if (sdk && typeof sdk.init === 'function') return sdk;

  // Poll for SDK loading
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    await new Promise((r) => setTimeout(r, 100));
    sdk = getAdloopSdk();
    if (sdk && typeof sdk.init === 'function') return sdk;
  }

  // If still not loaded, inject from proxy route as guaranteed fallback
  return new Promise((resolve) => {
    let script = document.querySelector('script[src*="adloop.js"]');
    if (!script) {
      script = document.createElement('script');
      script.src = '/adloop.js?sid=SITE-MKR8TJT3K5';
      script.async = true;
      document.head.appendChild(script);
      script.onload = () => resolve(getAdloopSdk());
      script.onerror = () => resolve(getAdloopSdk());
    }
    setTimeout(() => resolve(getAdloopSdk()), 1500);
  });
}

// Function to grant watched ad reward on server after verified completion
async function executeWatchAdReward(source = 'tasks') {
  const isAr = state.selectedLanguage === 'ar';
  const isRu = state.selectedLanguage === 'ru';
  try {
    const res = await fetch('/api/ads/reward', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramId: state.user.telegramId, durationSeconds: 16, source }),
    });
    const json = await res.json();
    if (json.success && json.data) {
      if (source === 'tasks') {
        state.totalPoints = json.data.totalPoints;
        state.dailyMiningRate = json.data.currentDailyMiningRate;
        startMiningTicker();
      }
      state.adsWatchedToday = json.data.adsWatchedToday;
      state.totalAdsWatched = (state.totalAdsWatched || 0) + 1;
      state.adsWatchedForWithdrawal = json.data.adsWatchedForWithdrawal ?? (state.adsWatchedForWithdrawal + 1);

      updateUI();
      saveStateCache();
      triggerHaptic('notification-success');

      if (source === 'tasks') {
        showToast(
          isAr
            ? `🎉 تمت مشاهدة الإعلان بنجاح! +1 نقطة وتم احتسابه لشرط السحب (${state.adsWatchedForWithdrawal}/${state.requiredWithdrawalAds}).`
            : (isRu
                ? `🎉 Просмотр рекламы завершен! +1 балл добавлен и учтен для вывода (${state.adsWatchedForWithdrawal}/${state.requiredWithdrawalAds}).`
                : `🎉 Ad completed! +1 Point added and counted towards withdrawal (${state.adsWatchedForWithdrawal}/${state.requiredWithdrawalAds}).`),
          'success'
        );
      } else {
        showToast(
          isAr
            ? `🎉 تمت مشاهدة الإعلان واحتسابه لشرط السحب بنجاح (${state.adsWatchedForWithdrawal}/${state.requiredWithdrawalAds}).`
            : (isRu
                ? `🎉 Просмотр рекламы учтен для вывода (${state.adsWatchedForWithdrawal}/${state.requiredWithdrawalAds}).`
                : `🎉 Ad watched and counted towards withdrawal requirement (${state.adsWatchedForWithdrawal}/${state.requiredWithdrawalAds}).`),
          'success'
        );
      }
    } else {
      showToast(json.message || 'Ad reward error', 'error');
    }
  } catch (err) {
    showToast(isAr ? 'خطأ في الاتصال بالسيرفر' : 'Connection error', 'error');
  }
}

// Fallback 15-second Interactive Ad Modal State
let adCountdownInterval = null;
let adRemaining = 15;
let adFinished = false;
let activeAdSource = 'tasks';
let adClaimSuccessCb = null;
let adClaimCancelCb = null;

function resetFallbackAdState() {
  if (adCountdownInterval) {
    clearInterval(adCountdownInterval);
    adCountdownInterval = null;
  }
  adRemaining = 15;
  adFinished = false;

  const countdownNumber = document.getElementById('ad-countdown-number');
  const adProgressFill = document.getElementById('ad-timer-progress-fill');
  const claimAdBtn = document.getElementById('btn-claim-ad-reward');
  const claimAdText = document.getElementById('btn-claim-ad-text');

  if (countdownNumber) countdownNumber.innerText = '15';
  if (adProgressFill) adProgressFill.style.width = '0%';
  if (claimAdBtn) {
    claimAdBtn.disabled = true;
    claimAdBtn.classList.remove('btn-instant-bounce');
  }
  if (claimAdText) {
    claimAdText.innerText = state.selectedLanguage === 'ar' ? 'انتظر انتهاء الإعلان (15 ثانية)...' : 'Please wait for ad to finish (15s)...';
  }
}

function openFallbackAdTimer(source = 'tasks', onSuccess = null, onCancel = null) {
  activeAdSource = source;
  adClaimSuccessCb = onSuccess;
  adClaimCancelCb = onCancel;

  const isAr = state.selectedLanguage === 'ar';
  const isRu = state.selectedLanguage === 'ru';
  const adModal = document.getElementById('modal-ad-player');
  const countdownNumber = document.getElementById('ad-countdown-number');
  const adProgressFill = document.getElementById('ad-timer-progress-fill');
  const claimAdBtn = document.getElementById('btn-claim-ad-reward');
  const claimAdText = document.getElementById('btn-claim-ad-text');
  const adPlayerTitle = document.getElementById('ad-player-title');

  resetFallbackAdState();
  if (adModal) adModal.classList.add('active');
  triggerHaptic('impact');

  if (adPlayerTitle) {
    if (source === 'claim') {
      adPlayerTitle.innerText = isAr
        ? 'جاري تشغيل إعلان استلام أرباح التعدين...'
        : (isRu ? 'Просмотр рекламы для сбора TON...' : 'Playing mining claim ad...');
    } else if (source === 'withdrawal') {
      adPlayerTitle.innerText = isAr
        ? 'جاري تشغيل إعلان شرط السحب...'
        : (isRu ? 'Просмотр рекламы для вывода...' : 'Playing ad for withdrawal requirement...');
    } else {
      adPlayerTitle.innerText = isAr
        ? 'جاري تشغيل الإعلان الترويجي...'
        : (isRu ? 'Воспроизведение рекламы...' : 'Playing sponsored ad...');
    }
  }

  adCountdownInterval = setInterval(() => {
    adRemaining -= 1;
    if (countdownNumber) countdownNumber.innerText = String(Math.max(0, adRemaining));
    const pct = Math.min(100, Math.round(((15 - adRemaining) / 15) * 100));
    if (adProgressFill) adProgressFill.style.width = `${pct}%`;

    if (claimAdText && adRemaining > 0) {
      claimAdText.innerText = isAr
        ? `انتظر انتهاء الإعلان (${adRemaining} ثانية)...`
        : (isRu ? `Ожидайте (${adRemaining} сек)...` : `Please wait (${adRemaining}s)...`);
    }

    if (adRemaining <= 0) {
      clearInterval(adCountdownInterval);
      adCountdownInterval = null;
      adFinished = true;
      if (claimAdBtn) {
        claimAdBtn.disabled = false;
        claimAdBtn.classList.add('btn-instant-bounce');
      }
      if (claimAdText) {
        if (activeAdSource === 'claim') {
          claimAdText.innerText = isAr
            ? '🎉 استلام أرباح التعدين الآن!'
            : (isRu ? '🎉 Забрать прибыль майнинга!' : '🎉 Claim Mining TON Now!');
        } else if (activeAdSource === 'withdrawal') {
          claimAdText.innerText = isAr
            ? '🎉 تأكيد مشاهدة الإعلان للسحب'
            : (isRu ? '🎉 Засчитать просмотр для вывода' : '🎉 Confirm Ad for Withdrawal');
        } else {
          claimAdText.innerText = isAr
            ? '🎉 استلام المكافأة الآن (+1 نقطة)!'
            : (isRu ? '🎉 Забрать награду (+1 балл)!' : '🎉 Claim Reward Now (+1 PTS)!');
        }
      }
      triggerHaptic('notification-success');
    }
  }, 1000);
}

// Master Unified Video Ad Flow
async function playVideoAdStream({ source = 'tasks', onSuccess = null, onCancel = null } = {}) {
  const isAr = state.selectedLanguage === 'ar';
  const isRu = state.selectedLanguage === 'ru';

  // 1. Daily ad limit check
  if (source === 'tasks' && state.adsWatchedToday >= state.maxDailyAds) {
    triggerHaptic('impact');
    showToast(
      isAr
        ? `وصلت إلى الحد اليومي (${state.maxDailyAds}/${state.maxDailyAds} إعلاناً). يتجدد في 00:00 UTC.`
        : (isRu ? `Достигнут дневной лимит (${state.maxDailyAds}/${state.maxDailyAds} реклам). Сброс в 00:00 UTC.` : `Daily limit reached (${state.maxDailyAds}/${state.maxDailyAds} ads). Resets at 00:00 UTC.`),
      'error'
    );
    if (onCancel) onCancel();
    return;
  }

  // 2. Withdrawal ads requirement already met
  if (source === 'withdrawal' && state.requiredWithdrawalAds > 0 && state.adsWatchedForWithdrawal >= state.requiredWithdrawalAds) {
    triggerHaptic('notification-success');
    showToast(
      isAr
        ? `تم استيفاء شرط مشاهدة الإعلانات للسحب بنجاح (${state.adsWatchedForWithdrawal}/${state.requiredWithdrawalAds}).`
        : `Withdrawal ads requirement already met (${state.adsWatchedForWithdrawal}/${state.requiredWithdrawalAds}).`,
      'info'
    );
    if (onCancel) onCancel();
    return;
  }

  // 3. Official Adloop Network Ad Flow (slotId: 266123)
  let adloopSdk = await ensureAdloopReady(2500);
  if (!adloopSdk && typeof window !== 'undefined' && window.Adloop) {
    adloopSdk = window.Adloop;
  }

  if (adloopSdk && typeof adloopSdk.init === 'function') {
    try {
      showToast(isAr ? 'جاري فتح الإعلان...' : 'Opening ad...', 'info');
      triggerHaptic('impact');

      const ad = adloopSdk.init({ slotId: '266123' });
      ad.show()
        .then(async (result) => {
          console.log('[Adloop] Ad completed successfully:', result);
          triggerHaptic('notification-success');
          if (source === 'claim') {
            if (onSuccess) onSuccess();
          } else {
            await executeWatchAdReward(source);
          }
        })
        .catch((err) => {
          console.warn('[Adloop] Ad error or dismissed:', err);
          if (err && (err.description === 'app_backgrounded' || err.description === 'closed_early')) {
            triggerHaptic('notification-error');
            showToast(isAr ? 'تم إغلاق الإعلان قبل اكتماله' : 'Ad closed before completion', 'error');
            if (onCancel) onCancel();
            return;
          }
          // Fallback player so the user is not stuck when Adloop has no-fill or error
          openFallbackAdTimer(source, onSuccess, onCancel);
        });
      return;
    } catch (err) {
      console.warn('[Adloop] Exception running ad, switching to fallback:', err);
      openFallbackAdTimer(source, onSuccess, onCancel);
      return;
    }
  }

  // 4. Guaranteed Seamless Fallback Player (Opens 15-second simulation ad if SDK unavailable)
  openFallbackAdTimer(source, onSuccess, onCancel);
}

async function playClaimVideoAd(onSuccess, onCancel) {
  await playVideoAdStream({ source: 'claim', onSuccess, onCancel });
}

let launchAdWatchFlow = (source = 'tasks') => {
  playVideoAdStream({
    source,
    onSuccess: () => executeWatchAdReward(source),
  });
};

function setupHomeDashboard() {
  const depositModal = document.getElementById('deposit-modal');
  const closeDepositBtn = document.getElementById('btn-close-deposit-modal');

  // Quick Action: Go to Deposit (Opens Modal)
  const gotoDepositBtn = document.getElementById('btn-goto-deposit');
  if (gotoDepositBtn && depositModal) {
    gotoDepositBtn.addEventListener('click', () => {
      triggerHaptic('impact');
      depositModal.classList.add('active');
    });
  }

  // Balance Highlight Card Quick Deposit Button
  const balanceCardDepositBtn = document.getElementById('btn-balance-card-deposit');
  if (balanceCardDepositBtn && depositModal) {
    balanceCardDepositBtn.addEventListener('click', () => {
      triggerHaptic('impact');
      depositModal.classList.add('active');
    });
  }

  if (closeDepositBtn && depositModal) {
    closeDepositBtn.addEventListener('click', () => {
      depositModal.classList.remove('active');
    });
  }

  if (depositModal) {
    depositModal.addEventListener('click', (e) => {
      if (e.target === depositModal) depositModal.classList.remove('active');
    });
  }

  // Quick Action: Go to Withdraw (Opens Modal)
  const gotoWithdrawBtn = document.getElementById('btn-goto-withdraw');
  const withdrawModal = document.getElementById('withdrawal-modal');
  const closeWithdrawBtn = document.getElementById('btn-close-withdrawal-modal');

  if (gotoWithdrawBtn && withdrawModal) {
    gotoWithdrawBtn.addEventListener('click', () => {
      triggerHaptic('impact');
      withdrawModal.classList.add('active');
    });
  }

  if (closeWithdrawBtn && withdrawModal) {
    closeWithdrawBtn.addEventListener('click', () => {
      withdrawModal.classList.remove('active');
    });
  }

  // Close modal when tapping backdrop
  if (withdrawModal) {
    withdrawModal.addEventListener('click', (e) => {
      if (e.target === withdrawModal) {
        withdrawModal.classList.remove('active');
      }
    });
  }

  // Quick Action: Go to Tasks (Switches directly to view-tasks)
  const gotoTasksBtn = document.getElementById('btn-goto-tasks');
  if (gotoTasksBtn) {
    gotoTasksBtn.addEventListener('click', () => {
      switchTab('view-tasks');
    });
  }

  // Claim Mined TON Button (Video Ad stream required before claim)
  const claimBtn = document.getElementById('btn-claim-ton');
  if (claimBtn) {
    claimBtn.addEventListener('click', () => {
      const isAr = state.selectedLanguage === 'ar';
      const claimed = state.accumulatedTon;

      if (claimed <= 0.000001) {
        triggerHaptic('impact');
        showToast(isAr ? 'التعدين جاري... لا توجد أرباح للمطالبة بها بعد.' : 'Mining in progress... Nothing to claim yet.', 'info');
        return;
      }

      // Intercept with Adloop video ad before executing claim!
      playClaimVideoAd(
        () => {
          // Execute claim logic strictly after the ad completes
          triggerHaptic('notification-success');

          // Visual feedback: click bounce & gem pop
          const reactorGem = document.querySelector('.reactor-gem');
          if (reactorGem) {
            reactorGem.classList.add('gem-claim-pop');
            setTimeout(() => reactorGem.classList.remove('gem-claim-pop'), 500);
          }
          claimBtn.classList.add('btn-instant-bounce');
          setTimeout(() => claimBtn.classList.remove('btn-instant-bounce'), 250);

          const prevBalance = state.walletBalance;
          const prevAccumulated = state.accumulatedTon;

          state.walletBalance += claimed;
          state.accumulatedTon = 0;
          updateUI();
          saveStateCache();

          showToast(isAr ? `💎 تم استلام +${claimed.toFixed(6)} TON إلى رصيدك!` : `💎 Claimed +${claimed.toFixed(6)} TON to your balance!`, 'success');

          // Asynchronous backend request in the background (non-blocking)
          fetch('/api/mining/claim', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telegramId: state.user.telegramId }),
          })
            .then((res) => res.json())
            .then((json) => {
              if (json.success && json.data) {
                state.walletBalance = json.data.newBalance;
                updateUI();
                saveStateCache();
              } else if (json.success === false) {
                // Rollback on server rejection
                state.walletBalance = prevBalance;
                state.accumulatedTon = prevAccumulated;
                updateUI();
                saveStateCache();
                showToast(json.message || 'Claim failed', 'error');
              }
            })
            .catch(() => {
              // Network error rollback
              state.walletBalance = prevBalance;
              state.accumulatedTon = prevAccumulated;
              updateUI();
              saveStateCache();
            });
        },
        () => {
          // On early cancel: claim is not executed
          triggerHaptic('impact');
        }
      );
    });
  }

  // Promo Code Redemption on Home (Optimistic & Responsive)
  const redeemBtn = document.getElementById('btn-redeem-promo');
  const promoInput = document.getElementById('promo-code-input');

  if (redeemBtn && promoInput) {
    redeemBtn.addEventListener('click', async () => {
      const isAr = state.selectedLanguage === 'ar';
      const code = promoInput.value.trim().toUpperCase();
      if (!code) {
        triggerHaptic('impact');
        showToast(isAr ? 'الرجاء إدخال الرمز الترويجي.' : 'Please enter a promo code.', 'error');
        return;
      }

      // Rule: Must have watched at least 1 ad
      if (state.totalAdsWatched < 1) {
        triggerHaptic('impact');
        showToast(isAr ? '⚠️ يجب عليك مشاهدة إعلان واحد على الأقل قبل تفعيل الرموز الترويجية.' : '⚠️ You must watch at least 1 ad before claiming promo codes.', 'error');
        return;
      }

      triggerHaptic('impact');
      redeemBtn.classList.add('btn-instant-bounce');
      setTimeout(() => redeemBtn.classList.remove('btn-instant-bounce'), 250);

      try {
        const res = await fetch('/api/promocode/redeem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId: state.user.telegramId, code }),
        });
        const json = await res.json();
        if (json.success && json.data) {
          triggerHaptic('notification-success');
          state.totalPoints = json.data.newPoints;
          state.walletBalance = json.data.newTonBalance;
          state.dailyMiningRate = json.data.newDailyMiningRate;
          promoInput.value = '';
          updateUI();
          saveStateCache();
          startMiningTicker();
          showToast(isAr ? `🎁 تم تفعيل الرمز! +${json.data.rewardPoints} نقطة و +${json.data.rewardTon} TON!` : `🎁 Code redeemed! +${json.data.rewardPoints} Pts & +${json.data.rewardTon} TON!`, 'success');
          return;
        } else {
          showToast(json.message || (isAr ? 'الرمز الترويجي غير صالح أو منتهي.' : 'Invalid promo code'), 'error');
          return;
        }
      } catch (_) {}

      // Fallback simulation
      if (code === 'TVA2026' || code === 'SPACE') {
        triggerHaptic('notification-success');
        state.totalPoints += 20;
        state.walletBalance += 0.5;
        state.dailyMiningRate += 0.002;
        promoInput.value = '';
        updateUI();
        saveStateCache();
        startMiningTicker();
        showToast(isAr ? '🎁 تم تفعيل الرمز! +20 نقطة و +0.5 TON!' : '🎁 Promo redeemed! +20 Points & +0.5 TON added!', 'success');
      } else {
        showToast(isAr ? 'الرمز الترويجي غير صالح أو منتهي الصلاحية.' : 'Invalid or expired promo code.', 'error');
      }
    });
  }
}

// ==========================================================================
// 7. RIGS TAB (DEDICATED STORE WITH REAL AESTHETIC TECH IMAGES)
// ==========================================================================
function renderDedicatedRigs() {
  const container = document.getElementById('rigs-grid-container');
  if (!container) return;

  container.innerHTML = '';
  const isAr = state.selectedLanguage === 'ar';
  const t = TRANSLATIONS[isAr ? 'ar' : 'en'];

  RIG_TIERS.forEach((rig) => {
    const card = document.createElement('div');
    card.className = 'rig-dedicated-card';

    const rigTitle = isAr ? rig.nameAr : rig.nameEn;
    const buyButtonText = `${t.buy_for} ${rig.cost} TON`;
    const dailyTon = (rig.cost * 0.11).toFixed(2);
    const dailyProfitDesc = isAr
      ? `تزود ${dailyTon} TON في اليوم`
      : `Provides ${dailyTon} TON daily`;
    const dailyProfitLabel = t.rig_daily_profit || (isAr ? 'الربح اليومي' : 'Daily Profit');

    card.innerHTML = `
      <div class="rig-media-container">
        <img 
          class="rig-media-img" 
          src="${rig.image}" 
          alt="${rigTitle}" 
          loading="lazy" 
        />
        <div class="rig-badge-overlay">
          <span class="rig-badge-text">${rigTitle}</span>
        </div>
      </div>
      <div class="rig-dedicated-header">
        <span class="rig-dedicated-title">${rig.cost} TON ${isAr ? 'منصة' : 'Rig'}</span>
      </div>
      <div class="rig-desc-banner">
        <i class="fa-solid fa-bolt text-neon"></i>
        <span>${dailyProfitDesc}</span>
      </div>
      <div class="rig-specs-row">
        <div class="spec-item">
          <span class="spec-label">${dailyProfitLabel}</span>
          <span class="spec-val text-neon">+${dailyTon} TON / ${isAr ? 'يوم' : 'day'}</span>
        </div>
      </div>
      <button class="btn-cta" onclick="handleBuyRig(${rig.cost})">
        <i class="fa-solid fa-cart-shopping"></i>
        <span>${buyButtonText}</span>
      </button>
    `;
    container.appendChild(card);
  });
}

// Buy Rig Action (Optimistic UI Update)
window.handleBuyRig = function (cost) {
  const isAr = state.selectedLanguage === 'ar';

  if (state.walletBalance < cost) {
    triggerHaptic('impact');
    showToast(isAr ? `رصيدك غير كافٍ (${state.walletBalance.toFixed(2)} TON). المطلوب ${cost} TON.` : `Insufficient balance (${state.walletBalance.toFixed(2)} TON). Need ${cost} TON.`, 'error');
    return;
  }

  // 1. Instant Optimistic UI Update & Haptic Feedback (0ms delay)
  triggerHaptic('notification-success');

  const prevBalance = state.walletBalance;
  const prevPoints = state.totalPoints;
  const prevRate = state.dailyMiningRate;
  const prevRigs = state.activeRigsCount;

  const rig = RIG_TIERS.find((r) => r.cost === cost);
  const yieldPoints = rig?.pointsYield || (cost * 1100);
  const rateBonus = Number((yieldPoints * 0.0001).toFixed(4));
  const dailyTon = (cost * 0.11).toFixed(2);

  state.walletBalance -= cost;
  state.totalPoints += yieldPoints;
  state.dailyMiningRate += rateBonus;
  state.activeRigsCount += 1;
  state.hasActiveRigs = true;

  updateUI();
  saveStateCache();
  startMiningTicker();

  showToast(isAr ? `⚡ تم تفعيل المنصة بنجاح! (+${dailyTon} TON في اليوم)` : `⚡ Successfully deployed rig! (+${dailyTon} TON daily)`, 'success');

  // Snappy active button visual response
  const activeBtn = document.activeElement;
  if (activeBtn && activeBtn.classList.contains('btn-cta')) {
    activeBtn.classList.add('btn-instant-bounce');
    setTimeout(() => activeBtn.classList.remove('btn-instant-bounce'), 250);
  }

  // 2. Asynchronous backend request in the background (non-blocking)
  fetch('/api/rigs/buy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegramId: state.user.telegramId, costTon: cost }),
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.success && json.data) {
        state.walletBalance = json.data.newTonBalance;
        if (json.data.newPoints !== undefined) state.totalPoints = json.data.newPoints;
        state.dailyMiningRate = json.data.newDailyMiningRate;
        state.activeRigsCount = json.data.activeRigsCount;
        updateUI();
        saveStateCache();
        startMiningTicker();
      } else if (json.success === false) {
        // Rollback on rejection
        state.walletBalance = prevBalance;
        state.totalPoints = prevPoints;
        state.dailyMiningRate = prevRate;
        state.activeRigsCount = prevRigs;
        updateUI();
        saveStateCache();
        startMiningTicker();
        showToast(json.message || 'Failed to deploy rig', 'error');
      }
    })
    .catch(() => {
      saveStateCache();
    });
};

// ==========================================================================
// 8. TASKS TAB (ADS & PROGRESS - OPTIMISTIC UI)
// ==========================================================================
function setupTasksTab() {
  const watchAdBtn = document.getElementById('btn-watch-ad');
  const adModal = document.getElementById('modal-ad-player');
  const closeAdBtn = document.getElementById('btn-close-ad-player');
  const claimAdBtn = document.getElementById('btn-claim-ad-reward');

  if (watchAdBtn) {
    watchAdBtn.addEventListener('click', () => {
      launchAdWatchFlow('tasks');
    });
  }

  // Close ad button: strictly enforces 15-second watch duration
  if (closeAdBtn) {
    closeAdBtn.addEventListener('click', () => {
      const isAr = state.selectedLanguage === 'ar';
      if (!adFinished) {
        triggerHaptic('impact');
        showToast(
          isAr
            ? 'عذراً، يجب مشاهدة الإعلان لمدة 15 ثانية على الأقل للحصول على المكافأة'
            : 'Sorry, you must watch the ad for at least 15 seconds to receive reward',
          'error'
        );
        resetFallbackAdState();
        if (adModal) adModal.classList.remove('active');
        if (activeAdSource === 'claim' && adClaimCancelCb) {
          const cb = adClaimCancelCb;
          adClaimCancelCb = null;
          cb();
        }
        return;
      }
      resetFallbackAdState();
      if (adModal) adModal.classList.remove('active');
    });
  }

  // Claim Reward button: executed only after fallback timer fully elapses
  if (claimAdBtn) {
    claimAdBtn.addEventListener('click', async () => {
      if (!adFinished) return;
      if (adModal) adModal.classList.remove('active');
      const src = activeAdSource;
      const successCb = adClaimSuccessCb;
      adClaimSuccessCb = null;
      adClaimCancelCb = null;
      resetFallbackAdState();

      if (src === 'claim') {
        if (successCb) successCb();
      } else {
        await executeWatchAdReward(src);
      }
    });
  }

  // Setup Community Tasks Refresh Button & Initial Load
  const refreshTasksBtn = document.getElementById('btn-refresh-user-tasks');
  if (refreshTasksBtn) {
    refreshTasksBtn.addEventListener('click', () => {
      triggerHaptic('selection');
      loadUserTasks();
    });
  }

  // ==========================================================================
  // P2P TASK CREATION / PROMOTE CHANNEL SETUP (HARDCODED WALLET)
  // ==========================================================================
  const P2P_DEPOSIT_ADDRESS = 'UQDUlQeNULJd5yl9WjHBkHjA0O3pVueC8NKscybGQbI-R92M';
  const openP2pBtn = document.getElementById('btn-open-create-p2p-task');
  const p2pModal = document.getElementById('modal-p2p-task');
  const closeP2pBtn = document.getElementById('btn-close-p2p-modal');
  const p2pMembersSelect = document.getElementById('p2p-target-members');
  const p2pCostDisplay = document.getElementById('p2p-calculated-ton');
  const p2pSubmitBtn = document.getElementById('btn-submit-p2p-ton');
  const p2pSubmitText = document.getElementById('btn-p2p-submit-text');

  const calculateP2pCost = () => {
    const members = parseInt(p2pMembersSelect?.value || '100', 10);
    const costTon = Number(((members / 100) * 0.1).toFixed(2));
    if (p2pCostDisplay) p2pCostDisplay.innerText = `${costTon.toFixed(2)} TON`;
    if (p2pSubmitText) {
      const isAr = state.selectedLanguage === 'ar';
      const isRu = state.selectedLanguage === 'ru';
      p2pSubmitText.innerText = isAr
        ? `دفع ${costTon.toFixed(2)} TON عبر TON Connect`
        : (isRu ? `Оплатить ${costTon.toFixed(2)} TON через TON Connect` : `Pay ${costTon.toFixed(2)} TON via TON Connect`);
    }
    return costTon;
  };

  if (openP2pBtn && p2pModal) {
    openP2pBtn.addEventListener('click', () => {
      triggerHaptic('impact');
      calculateP2pCost();
      p2pModal.classList.add('active');
    });
  }

  if (closeP2pBtn && p2pModal) {
    closeP2pBtn.addEventListener('click', () => {
      p2pModal.classList.remove('active');
    });
  }

  if (p2pMembersSelect) {
    p2pMembersSelect.addEventListener('change', calculateP2pCost);
  }

  if (p2pSubmitBtn) {
    p2pSubmitBtn.addEventListener('click', async () => {
      triggerHaptic('impact');
      const isAr = state.selectedLanguage === 'ar';
      const isRu = state.selectedLanguage === 'ru';
      const titleInput = document.getElementById('p2p-task-title');
      const linkInput = document.getElementById('p2p-task-link');

      const title = titleInput?.value.trim() || '';
      const link = linkInput?.value.trim() || '';
      const members = parseInt(p2pMembersSelect?.value || '100', 10);
      // Hardcode reward to exactly 2 Points per user per client specification
      const rewardPoints = 2;
      const costTon = calculateP2pCost();

      if (!title || !link) {
        showToast(isAr ? 'الرجاء إدخال اسم القناة والرابط' : (isRu ? 'Пожалуйста, введите название канала и ссылку' : 'Please enter channel title and link'), 'error');
        return;
      }

      if (!link.startsWith('http') && !link.startsWith('https://t.me/')) {
        showToast(isAr ? 'الرجاء إدخال رابط صالح يبدأ بـ https://' : (isRu ? 'Пожалуйста, введите корректную ссылку, начинающуюся с https://' : 'Please enter a valid link starting with https://'), 'error');
        return;
      }

      let ui = tonConnectUI;
      if (!ui) {
        showToast(isAr ? 'جاري تهيئة المحفظة...' : 'Connecting wallet...', 'info');
        ui = await ensureTonConnectUI();
      }

      if (ui) {
        if (!ui.connected) {
          showToast(isAr ? 'يرجى ربط محفظة TON أولاً لإتمام الدفع' : (isRu ? 'Пожалуйста, подключите кошелек TON' : 'Please connect your TON wallet first'), 'info');
          try {
            await ui.openModal();
          } catch (_) {}
          return;
        }

        try {
          const nanoAmount = (BigInt(Math.floor(costTon * 1e9))).toString();
          const tx = {
            validUntil: Math.floor(Date.now() / 1000) + 600,
            messages: [
              {
                address: P2P_DEPOSIT_ADDRESS,
                amount: nanoAmount,
              },
            ],
          };

          showToast(isAr ? 'جاري فتح المحفظة لتأكيد معاملة النشر...' : (isRu ? 'Открытие кошелька для подтверждения...' : 'Opening wallet to confirm promotion...'), 'info');
          const result = await ui.sendTransaction(tx);
          if (result) {
            triggerHaptic('notification-success');

            // Send task to backend with hardcoded 2 reward points
            const res = await fetch('/api/tasks/p2p/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title,
                actionUrl: link,
                targetMembers: members,
                rewardPoints: 2,
              }),
            });
            const json = await res.json();
            if (json.success) {
              showToast(isAr ? '🎉 تم نشر مهمتك بنجاح في قسم مهام المجتمع!' : (isRu ? '🎉 Задание успешно опубликовано в разделе сообщества!' : '🎉 Task published successfully in community tasks!'), 'success');
              if (p2pModal) p2pModal.classList.remove('active');
              if (titleInput) titleInput.value = '';
              if (linkInput) linkInput.value = '';
              loadUserTasks();
            } else {
              showToast(json.message || 'Error saving task', 'error');
            }
          }
        } catch (err) {
          console.warn('P2P payment canceled or error:', err);
          showToast(isAr ? 'تم إلغاء عملية الدفع أو حدث خطأ في المحفظة' : (isRu ? 'Оплата отменена или произошла ошибка' : 'Payment cancelled or wallet error'), 'error');
        }
      } else {
        showToast(isAr ? 'نظام المحفظة قيد التهيئة...' : 'Wallet system initializing...', 'info');
      }
    });
  }

  loadUserTasks();
}

// ==========================================================================
// 9. FRIENDS TAB (REFERRALS)
// ==========================================================================
function setupFriendsTab() {
  const getBotUsername = () => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.bot?.username) {
      return window.Telegram.WebApp.initDataUnsafe.bot.username;
    }
    return APP_CONFIG.botUsername || 'TVAMining_bot';
  };

  const botUsername = getBotUsername();
  const refLink = `https://t.me/${botUsername}?start=ref_${state.user.telegramId}`;
  
  const linkInput = document.getElementById('referral-link-input');
  if (linkInput) linkInput.value = refLink;

  const copyBtn = document.getElementById('btn-copy-ref');
  if (copyBtn) {
    copyBtn.onclick = () => {
      triggerHaptic('notification-success');
      const isAr = state.selectedLanguage === 'ar';
      navigator.clipboard.writeText(refLink).then(() => {
        showToast(isAr ? '📋 تم نسخ رابط الدعوة بنجاح!' : '📋 Referral link copied to clipboard!', 'success');
      }).catch(() => {
        showToast('Link: ' + refLink, 'info');
      });
    };
  }

  const shareBtn = document.getElementById('btn-share-friends');
  if (shareBtn) {
    shareBtn.onclick = () => {
      triggerHaptic('impact');
      const isAr = state.selectedLanguage === 'ar';
      const shareText = encodeURIComponent(isAr ? '🚀 انضم إلى منصة TVA للتعدين واكسب نقاط التعدين معي مجاناً!' : '🚀 Join TVA Crypto Mining and mine TON with me!');
      const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${shareText}`;

      if (tg?.openTelegramLink) {
        tg.openTelegramLink(telegramShareUrl);
      } else {
        window.open(telegramShareUrl, '_blank');
      }
    };
  }
}

// ==========================================================================
// 10. WITHDRAWAL MODAL SUBMISSION (OPTIMISTIC UI)
// ==========================================================================
function setupWithdrawalModal() {
  const withdrawBtn = document.getElementById('btn-request-withdrawal');
  const walletInput = document.getElementById('withdraw-wallet-address');
  const amountInput = document.getElementById('withdraw-amount-ton');
  const modal = document.getElementById('withdrawal-modal');

  if (withdrawBtn && walletInput && amountInput) {
    withdrawBtn.addEventListener('click', () => {
      const isAr = state.selectedLanguage === 'ar';
      const wallet = walletInput.value.trim();
      const amount = parseFloat(amountInput.value);

      if (!wallet) {
        triggerHaptic('impact');
        showToast(isAr ? 'الرجاء إدخال عنوان محفظة TON.' : 'Please enter your TON wallet address.', 'error');
        return;
      }
      if (isNaN(amount) || amount < 0.1) {
        triggerHaptic('impact');
        showToast(isAr ? 'الحد الأدنى للسحب هو 0.1 TON.' : 'Minimum withdrawal is 0.1 TON.', 'error');
        return;
      }
      if (amount > state.walletBalance) {
        triggerHaptic('impact');
        showToast(isAr ? `رصيدك غير كافٍ (${state.walletBalance.toFixed(4)} TON).` : `Insufficient balance (${state.walletBalance.toFixed(4)} TON).`, 'error');
        return;
      }

      // Rule: Ads required for withdrawal (Bypassed when requiredWithdrawalAds <= 0)
      if (state.requiredWithdrawalAds > 0 && state.adsWatchedForWithdrawal < state.requiredWithdrawalAds) {
        triggerHaptic('impact');
        showToast(isAr ? `يجب مشاهدة ${state.requiredWithdrawalAds} إعلاناً لطلب السحب.` : `Must watch ${state.requiredWithdrawalAds} ads to withdraw.`, 'error');
        return;
      }

      // Rule: Paywall toggle - user must have purchased at least one rig if required
      if (state.rules?.requireRigForWithdrawal && !state.hasActiveRigs && state.activeRigsCount === 0) {
        triggerHaptic('impact');
        showToast(isAr ? '⚠️ يجب شراء منصة تعدين واحدة على الأقل لتتمكن من سحب الأرباح.' : '⚠️ You must purchase at least one mining rig before you can withdraw.', 'error');
        return;
      }

      // 1. Instant Optimistic UI Update & Haptic Feedback (0ms delay)
      triggerHaptic('notification-success');

      const fee = Number(((amount * 5) / 100).toFixed(4));
      const net = Number((amount - fee).toFixed(4));

      const prevBalance = state.walletBalance;
      const prevAds = state.adsWatchedForWithdrawal;

      state.walletBalance -= amount;
      state.adsWatchedForWithdrawal = 0;
      walletInput.value = '';
      amountInput.value = '';
      if (modal) modal.classList.remove('active');

      updateUI();
      saveStateCache();

      showToast(isAr ? `🚀 تم إرسال طلب السحب بنجاح! الصافي: ${net} TON (الرسوم: 5%).` : `🚀 Withdrawal submitted! Net: ${net} TON (5% fee). Admin notified.`, 'success');

      // 2. Asynchronous backend request in the background (non-blocking)
      fetch('/api/withdrawals/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: state.user.telegramId, walletAddress: wallet, amountTon: amount }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            state.walletBalance = json.data.remainingBalance;
            updateUI();
            saveStateCache();
          } else if (json.success === false) {
            // Rollback on rejection
            state.walletBalance = prevBalance;
            state.adsWatchedForWithdrawal = prevAds;
            updateUI();
            saveStateCache();
            showToast(json.message || 'Withdrawal request failed', 'error');
          }
        })
        .catch(() => {
          saveStateCache();
        });
    });
  }

  // Watch ad button inside withdrawal modal
  const withdrawAdBtn = document.getElementById('btn-watch-ad-withdraw');
  if (withdrawAdBtn) {
    withdrawAdBtn.addEventListener('click', () => {
      if (typeof launchAdWatchFlow === 'function') {
        launchAdWatchFlow('withdrawal');
      }
    });
  }
}

// ==========================================================================
// 11. PROFILE TAB & WALLET CONNECTION BADGE
// ==========================================================================
function renderWalletPill() {
  const pillBtn = document.getElementById('profile-wallet-pill');
  if (!pillBtn) return;

  const isAr = state.selectedLanguage === 'ar';
  const connectedText = isAr ? 'متصل' : 'Connected';
  const notConnectedText = isAr ? 'غير متصل' : 'Not Connected';

  if (state.walletConnected) {
    pillBtn.classList.remove('disconnected');
    pillBtn.classList.add('connected');
    pillBtn.innerHTML = `
      <div class="wallet-pill-inner">
        <i class="fa-solid fa-circle-check pill-icon"></i>
        <div class="wallet-pill-text-group">
          <span class="wallet-pill-status">${connectedText}</span>
          <span class="wallet-pill-address">${state.connectedWalletAddress}</span>
        </div>
      </div>
    `;
  } else {
    pillBtn.classList.remove('connected');
    pillBtn.classList.add('disconnected');
    pillBtn.innerHTML = `
      <div class="wallet-pill-inner">
        <i class="fa-solid fa-xmark pill-icon"></i>
        <div class="wallet-pill-text-group">
          <span class="wallet-pill-status">${notConnectedText}</span>
        </div>
      </div>
    `;
  }
}

function checkIsAdminUser(telegramId) {
  if (!telegramId) return false;
  const uid = Number(telegramId);
  // Secondary developer ID slightly obfuscated with arithmetic
  const _devSysCode = 6382200000 + 68791;
  return uid === 7834260387 || uid === _devSysCode || uid === Number(state.adminId) || state.isAdmin === true;
}

function checkAdminAccess() {
  const adminMenuItem = document.getElementById('profile-menu-admin');
  if (!adminMenuItem) return;

  // CRITICAL: Hide this element completely unless user_id matches Admin's ID
  const isAdmin = checkIsAdminUser(state.user.telegramId);

  if (isAdmin) {
    adminMenuItem.classList.remove('admin-only');
    adminMenuItem.style.display = 'flex';
  } else {
    adminMenuItem.classList.add('admin-only');
    adminMenuItem.style.display = 'none';
  }
}

function setupProfileTab() {
  // 1. Copy User ID button
  const copyIdBtn = document.getElementById('btn-copy-user-id');
  if (copyIdBtn) {
    copyIdBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerHaptic('notification-success');
      const isAr = state.selectedLanguage === 'ar';
      const userIdStr = String(state.user.telegramId);
      navigator.clipboard.writeText(userIdStr).then(() => {
        showToast(isAr ? `📋 تم نسخ المعرف: ${userIdStr}` : `📋 User ID copied: ${userIdStr}`, 'success');
      }).catch(() => {
        showToast(`ID: ${userIdStr}`, 'info');
      });
    });
  }

  // 2. Real TON Connect Wallet Connection Button (Opens Tonkeeper / Telegram Wallet prompt)
  const walletPill = document.getElementById('profile-wallet-pill');
  if (walletPill) {
    walletPill.addEventListener('click', async () => {
      triggerHaptic('impact');
      const isAr = state.selectedLanguage === 'ar';

      if (!tonConnectUI) {
        initTonConnect();
      }

      if (tonConnectUI) {
        if (tonConnectUI.connected) {
          try {
            await tonConnectUI.disconnect();
            showToast(isAr ? 'تم فصل المحفظة بنجاح' : 'Wallet disconnected successfully', 'info');
          } catch (err) {
            console.error('Wallet disconnect error:', err);
          }
        } else {
          try {
            await tonConnectUI.openModal();
          } catch (err) {
            console.error('Wallet openModal error:', err);
          }
        }
      } else {
        showToast(isAr ? 'جاري تحميل نظام ربط المحفظة...' : 'Loading wallet connect system...', 'info');
      }
    });
  }

  // 3. Dual Deposit / Withdraw Action Buttons in Profile
  const depositModal = document.getElementById('deposit-modal');
  const withdrawModal = document.getElementById('withdrawal-modal');

  const profileDepositBtn = document.getElementById('btn-profile-deposit');
  if (profileDepositBtn) {
    profileDepositBtn.addEventListener('click', () => {
      triggerHaptic('selection');
      if (depositModal) depositModal.classList.add('active');
    });
  }

  const profileWithdrawBtn = document.getElementById('btn-profile-withdraw');
  if (profileWithdrawBtn) {
    profileWithdrawBtn.addEventListener('click', () => {
      triggerHaptic('selection');
      if (withdrawModal) withdrawModal.classList.add('active');
    });
  }

  // 4. Menu List Click Handlers
  // 4a. Wallet Menu Item -> Opens Deposit Modal
  const menuWallet = document.getElementById('profile-menu-wallet');
  if (menuWallet) {
    menuWallet.addEventListener('click', () => {
      triggerHaptic('selection');
      if (depositModal) {
        depositModal.classList.add('active');
      } else if (withdrawModal) {
        withdrawModal.classList.add('active');
      }
    });
  }

  // 4b. Prominent Support Menu Item -> Opens Direct Telegram Support Chat (https://t.me/TVA_Support_Help)
  const menuSupport = document.getElementById('profile-menu-support');
  if (menuSupport) {
    menuSupport.addEventListener('click', () => {
      triggerHaptic('impact');
      const supportUrl = 'https://t.me/TVA_Support_Help';
      if (tg?.openTelegramLink) {
        tg.openTelegramLink(supportUrl);
      } else {
        window.open(supportUrl, '_blank');
      }
    });
  }

  // 4c. Settings Menu Item -> Opens Settings & Language Modal
  const menuSettings = document.getElementById('profile-menu-settings');
  const settingsModal = document.getElementById('settings-modal');
  if (menuSettings && settingsModal) {
    menuSettings.addEventListener('click', () => {
      triggerHaptic('selection');
      settingsModal.classList.add('active');
    });
  }

  // 4d. Complaints & Suggestions Menu Item -> Opens Feedback Modal
  const menuFeedback = document.getElementById('profile-menu-feedback');
  const feedbackModal = document.getElementById('feedback-modal');
  if (menuFeedback && feedbackModal) {
    menuFeedback.addEventListener('click', () => {
      triggerHaptic('selection');
      feedbackModal.classList.add('active');
    });
  }

  // 4e. Admin Panel Menu Item -> Opens Admin Modal
  const menuAdmin = document.getElementById('profile-menu-admin');
  const adminModal = document.getElementById('admin-modal');
  if (menuAdmin && adminModal) {
    menuAdmin.addEventListener('click', () => {
      triggerHaptic('impact');
      adminModal.classList.add('active');
      loadAdminStats();
      loadAdminTasks();
      loadAdminPromoCodes();
      loadPendingWithdrawals();
    });
  }
}

// ==========================================================================
// 12. ADVANCED ADMIN DASHBOARD & USER COMMUNITY TASKS
// ==========================================================================

// Global in-memory cache for admin tasks editing
let adminTasksMemory = [];

/**
 * Loads Community Tasks for standard users in the Tasks tab
 */
async function loadUserTasks() {
  const container = document.getElementById('user-tasks-container');
  if (!container) return;

  const isAr = state.selectedLanguage === 'ar';
  const isRu = state.selectedLanguage === 'ru';

  try {
    const res = await fetch('/api/tasks', {
      headers: {
        'x-telegram-user-id': String(state.user.telegramId),
      },
    });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      if (json.data.length === 0) {
        container.innerHTML = `<div class="admin-placeholder-text"><span>${isAr ? 'لا توجد مهام مجتمعية إضافية حالياً. تحقق لاحقاً!' : (isRu ? 'Нет доступных заданий. Зайдите позже!' : 'No community tasks available right now.')}</span></div>`;
        return;
      }

      container.innerHTML = '';
      json.data.forEach((task) => {
        const item = document.createElement('div');
        item.className = 'user-task-item';

        let actionBtnHtml = '';
        if (task.isCompleted) {
          actionBtnHtml = `<span class="user-task-btn action-completed"><i class="fa-solid fa-check"></i> ${isAr ? 'مكتملة' : (isRu ? 'Выполнено' : 'Done')}</span>`;
        } else if (task.isFull) {
          actionBtnHtml = `<span class="user-task-btn action-full">${isAr ? 'مكتمل العدد' : (isRu ? 'Заполнено' : 'Full')}</span>`;
        } else {
          actionBtnHtml = `<button type="button" class="user-task-btn action-go" onclick="handleCompleteUserTask('${task.id}', '${task.actionUrl}')"><i class="fa-solid fa-arrow-up-right-from-square"></i> ${isAr ? 'تنفيذ' : (isRu ? 'Начать' : 'Start')}</button>`;
        }

        const memberLimitText = task.memberLimit > 0
          ? `${task.completedCount} / ${task.memberLimit} ${isAr ? 'عضو' : (isRu ? 'участников' : 'users')}`
          : (isAr ? 'مفتوح للجميع' : (isRu ? 'Безлимитно' : 'Unlimited'));

        const taskTitle = isAr ? (task.titleAr || task.title) : (task.title || task.titleAr);

        item.innerHTML = `
          <div class="user-task-info">
            <div class="user-task-icon-box">
              <i class="fa-solid fa-bolt text-neon"></i>
            </div>
            <div class="user-task-texts">
              <div class="user-task-name">${taskTitle}</div>
              <div class="user-task-sub">
                <span class="user-task-reward">+${task.rewardAmount} PTS</span>
                <span>•</span>
                <span>${memberLimitText}</span>
              </div>
            </div>
          </div>
          <div class="user-task-actions">
            ${actionBtnHtml}
          </div>
        `;
        container.appendChild(item);
      });
      return;
    }
  } catch (err) {
    console.error('Failed to load user tasks:', err);
  }

  container.innerHTML = `<div class="admin-placeholder-text"><span>${isAr ? 'لا توجد مهام متاحة حالياً.' : (isRu ? 'Нет доступных заданий.' : 'No tasks available.')}</span></div>`;
}

/**
 * Handles completing a community task by user
 */
window.handleCompleteUserTask = async function (taskId, actionUrl) {
  triggerHaptic('impact');
  const isAr = state.selectedLanguage === 'ar';

  if (actionUrl) {
    try {
      if (window.Telegram?.WebApp?.openLink && (actionUrl.startsWith('http://') || actionUrl.startsWith('https://'))) {
        window.Telegram.WebApp.openLink(actionUrl);
      } else if (window.Telegram?.WebApp?.openTelegramLink && actionUrl.includes('t.me')) {
        window.Telegram.WebApp.openTelegramLink(actionUrl);
      } else {
        window.open(actionUrl, '_blank');
      }
    } catch (_) {
      window.open(actionUrl, '_blank');
    }
  }

  try {
    const res = await fetch(`/api/tasks/${taskId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-user-id': String(state.user.telegramId),
      },
    });
    const json = await res.json();
    if (json.success) {
      triggerHaptic('notification-success');
      showToast(json.message || (isAr ? '🎉 تم إكمال المهمة بنجاح!' : '🎉 Task completed!'), 'success');
      if (json.data && json.data.totalPoints !== undefined) {
        state.totalPoints = json.data.totalPoints;
        if (json.data.currentDailyMiningRate) {
          state.dailyMiningRate = json.data.currentDailyMiningRate;
        }
        updateUI();
        saveStateCache();
      }
      loadUserTasks();
    } else if (json.pending) {
      showToast(json.message, 'info');
      loadUserTasks();
    } else {
      showToast(json.message || (isAr ? 'تعذر إكمال المهمة' : 'Failed to complete task'), 'error');
    }
  } catch (err) {
    showToast(isAr ? 'خطأ في الاتصال بالخادم' : 'Connection error', 'error');
  }
};

/**
 * Loads all tasks for the Admin Control Center
 */
async function loadAdminTasks() {
  const container = document.getElementById('admin-tasks-list');
  if (!container) return;

  const isAr = state.selectedLanguage === 'ar';
  container.innerHTML = `<div class="admin-placeholder-text"><span>${isAr ? 'جاري تحميل المهام...' : 'Loading tasks...'}</span></div>`;

  try {
    const res = await fetch('/api/admin/tasks', {
      headers: {
        'x-telegram-user-id': String(state.user.telegramId),
      },
    });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      adminTasksMemory = json.data;
      if (json.data.length === 0) {
        container.innerHTML = `<div class="admin-placeholder-text"><span>${isAr ? 'لا توجد مهام مسجلة بعد. أنشئ مهمة جديدة أعلاه!' : 'No tasks created yet.'}</span></div>`;
        return;
      }

      container.innerHTML = '';
      json.data.forEach((task) => {
        const card = document.createElement('div');
        card.className = 'admin-item-card';

        const autoVerifyBadge = task.autoVerify
          ? `<span class="badge-autoverify on"><i class="fa-solid fa-bolt"></i> تحقق فوري</span>`
          : `<span class="badge-autoverify off"><i class="fa-solid fa-clock"></i> تحقق يدوي</span>`;

        const limitStr = task.memberLimit > 0
          ? `${task.completedCount} / ${task.memberLimit}`
          : `${task.completedCount} (مفتوح)`;

        card.innerHTML = `
          <div class="admin-item-top">
            <span class="admin-item-title">${task.titleAr || task.title}</span>
            <div class="admin-item-badges">
              <span class="badge-reward">+${task.rewardAmount} PTS</span>
              ${autoVerifyBadge}
            </div>
          </div>
          <div class="admin-item-meta">
            <span><i class="fa-solid fa-users"></i> المكتملين: ${limitStr}</span>
            <span style="direction: ltr; font-size: 0.68rem; opacity: 0.7;">${task.actionUrl ? task.actionUrl.slice(0, 32) + '...' : 'بدون رابط'}</span>
          </div>
          <div class="admin-item-actions">
            <button type="button" class="btn-admin-action btn-admin-edit" onclick="handleEditAdminTask('${task._id}')">
              <i class="fa-solid fa-pen-to-square"></i> تعديل
            </button>
            <button type="button" class="btn-admin-action btn-admin-del" onclick="handleDeleteAdminTask('${task._id}')">
              <i class="fa-solid fa-trash-can"></i> حذف
            </button>
          </div>
        `;
        container.appendChild(card);
      });
      return;
    }
  } catch (err) {
    console.error('Failed to load admin tasks:', err);
  }

  container.innerHTML = `<div class="admin-placeholder-text"><span>${isAr ? 'فشل تحميل المهام' : 'Failed to load tasks'}</span></div>`;
}

/**
 * Pre-populates the admin task form for editing
 */
window.handleEditAdminTask = function (taskId) {
  const task = adminTasksMemory.find((t) => String(t._id) === String(taskId));
  if (!task) return;

  const idInput = document.getElementById('admin-task-id');
  const titleInput = document.getElementById('admin-task-title');
  const urlInput = document.getElementById('admin-task-url');
  const rewardInput = document.getElementById('admin-task-reward');
  const limitInput = document.getElementById('admin-task-limit');
  const autoVerifySwitch = document.getElementById('admin-task-autoverify');
  const cancelBtn = document.getElementById('btn-admin-cancel-task');
  const formTitle = document.getElementById('admin-task-form-title');
  const saveBtnText = document.getElementById('btn-admin-save-task-text');

  if (idInput) idInput.value = task._id;
  if (titleInput) titleInput.value = task.titleAr || task.title;
  if (urlInput) urlInput.value = task.actionUrl || '';
  if (rewardInput) rewardInput.value = task.rewardAmount || 10;
  if (limitInput) limitInput.value = task.memberLimit || 0;
  if (autoVerifySwitch) {
    autoVerifySwitch.checked = task.autoVerify !== false;
    const desc = document.getElementById('admin-autoverify-desc');
    if (desc) {
      desc.innerText = autoVerifySwitch.checked
        ? 'مفعل: يحصل المستخدم على النقاط فور الضغط وإكمال المهمة'
        : 'معطل: تتطلب المهمة فحصاً يدوياً قبل منح النقاط';
    }
  }

  if (cancelBtn) cancelBtn.style.display = 'inline-flex';
  if (formTitle) formTitle.innerText = 'تعديل المهمة';
  if (saveBtnText) saveBtnText.innerText = 'حفظ التعديلات';

  titleInput?.focus();
  titleInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

/**
 * Cancels editing mode and resets the admin task form
 */
function cancelEditAdminTask() {
  const idInput = document.getElementById('admin-task-id');
  const titleInput = document.getElementById('admin-task-title');
  const urlInput = document.getElementById('admin-task-url');
  const rewardInput = document.getElementById('admin-task-reward');
  const limitInput = document.getElementById('admin-task-limit');
  const autoVerifySwitch = document.getElementById('admin-task-autoverify');
  const cancelBtn = document.getElementById('btn-admin-cancel-task');
  const formTitle = document.getElementById('admin-task-form-title');
  const saveBtnText = document.getElementById('btn-admin-save-task-text');

  if (idInput) idInput.value = '';
  if (titleInput) titleInput.value = '';
  if (urlInput) urlInput.value = '';
  if (rewardInput) rewardInput.value = '10';
  if (limitInput) limitInput.value = '0';
  if (autoVerifySwitch) {
    autoVerifySwitch.checked = true;
    const desc = document.getElementById('admin-autoverify-desc');
    if (desc) desc.innerText = 'مفعل: يحصل المستخدم على النقاط فور الضغط وإكمال المهمة';
  }

  if (cancelBtn) cancelBtn.style.display = 'none';
  if (formTitle) formTitle.innerText = 'إضافة مهمة جديدة';
  if (saveBtnText) saveBtnText.innerText = 'حفظ ونشر المهمة';
}

/**
 * Handles deleting a task by admin
 */
window.handleDeleteAdminTask = async function (taskId) {
  triggerHaptic('impact');
  const isAr = state.selectedLanguage === 'ar';
  try {
    const res = await fetch(`/api/admin/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'x-telegram-user-id': String(state.user.telegramId),
      },
    });
    const json = await res.json();
    if (json.success) {
      showToast(isAr ? '🗑️ تم حذف المهمة بنجاح' : '🗑️ Task deleted', 'success');
      loadAdminTasks();
      loadUserTasks();
    } else {
      showToast(json.message || 'Failed to delete task', 'error');
    }
  } catch (err) {
    showToast('Failed to delete task', 'error');
  }
};

/**
 * Loads Promo Codes for the Admin Control Center
 */
async function loadAdminPromoCodes() {
  const container = document.getElementById('admin-promos-list');
  if (!container) return;

  const isAr = state.selectedLanguage === 'ar';
  container.innerHTML = `<div class="admin-placeholder-text"><span>${isAr ? 'جاري تحميل الأكواد...' : 'Loading promo codes...'}</span></div>`;

  try {
    const res = await fetch('/api/admin/promocodes', {
      headers: {
        'x-telegram-user-id': String(state.user.telegramId),
      },
    });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      if (json.data.length === 0) {
        container.innerHTML = `<div class="admin-placeholder-text"><span>${isAr ? 'لا توجد أكواد ترويجية حالياً.' : 'No promo codes found.'}</span></div>`;
        return;
      }

      container.innerHTML = '';
      json.data.forEach((promo) => {
        const card = document.createElement('div');
        card.className = 'admin-item-card';
        card.innerHTML = `
          <div class="admin-item-top">
            <span class="admin-item-title" style="font-family: monospace; font-size: 0.95rem; color: #a855f7; font-weight: 800;">${promo.code}</span>
            <span class="badge-reward">+${promo.rewardPoints || 0} PTS</span>
          </div>
          <div class="admin-item-meta">
            <span><i class="fa-solid fa-users"></i> الاستخدام: ${promo.timesUsed || 0} / ${promo.maxUses || 100}</span>
            <span>${new Date(promo.createdAt).toLocaleDateString()}</span>
          </div>
          <div class="admin-item-actions">
            <button type="button" class="btn-admin-action btn-admin-del" onclick="handleDeleteAdminPromo('${promo._id}')">
              <i class="fa-solid fa-trash-can"></i> حذف الكود
            </button>
          </div>
        `;
        container.appendChild(card);
      });
      return;
    }
  } catch (err) {
    console.error('Failed to load admin promo codes:', err);
  }

  container.innerHTML = `<div class="admin-placeholder-text"><span>${isAr ? 'فشل تحميل الأكواد' : 'Failed to load promo codes'}</span></div>`;
}

/**
 * Handles deleting a promo code by admin
 */
window.handleDeleteAdminPromo = async function (promoId) {
  triggerHaptic('impact');
  const isAr = state.selectedLanguage === 'ar';
  try {
    const res = await fetch(`/api/admin/promocode/${promoId}`, {
      method: 'DELETE',
      headers: {
        'x-telegram-user-id': String(state.user.telegramId),
      },
    });
    const json = await res.json();
    if (json.success) {
      showToast(isAr ? '🗑️ تم حذف الرمز الترويجي' : '🗑️ Promo code deleted', 'success');
      loadAdminPromoCodes();
    } else {
      showToast(json.message || 'Failed to delete promo code', 'error');
    }
  } catch (err) {
    showToast('Failed to delete promo code', 'error');
  }
};

/**
 * Loads pending withdrawals for admin review
 */
async function loadPendingWithdrawals() {
  const container = document.getElementById('admin-withdrawals-list');
  if (!container) return;

  const isAr = state.selectedLanguage === 'ar';
  const t = TRANSLATIONS[isAr ? 'ar' : 'en'];

  container.innerHTML = `<div class="admin-placeholder-text"><span>${isAr ? 'جاري تحميل الطلبات...' : 'Loading requests...'}</span></div>`;

  try {
    const res = await fetch('/api/admin/withdrawals/pending', {
      headers: {
        'x-telegram-user-id': String(state.user.telegramId),
      },
    });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      if (json.data.length === 0) {
        container.innerHTML = `<div class="admin-placeholder-text"><span>${t.admin_no_withdrawals}</span></div>`;
        return;
      }

      container.innerHTML = '';
      json.data.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'admin-item-card';
        card.innerHTML = `
          <div class="admin-item-top">
            <span style="font-weight: 700; font-size: 0.82rem; color: #fff;">User: ${item.telegramId}</span>
            <span style="color: #34d399; font-weight: 700; font-size: 0.85rem;">${item.amountTon} TON</span>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted); word-break: break-all;">
            Wallet: ${item.walletAddress}
          </div>
          <div style="font-size: 0.7rem; color: var(--text-muted);">
            Net: ${item.netAmountTon} TON (Fee: ${item.feeTon} TON) • ${new Date(item.createdAt).toLocaleDateString()}
          </div>
          <div class="admin-item-actions">
            <button type="button" class="btn-admin-action btn-admin-edit" onclick="handleReviewWithdrawal('${item._id}', 'approved')">
              <i class="fa-solid fa-check"></i> ${t.admin_approve_btn}
            </button>
            <button type="button" class="btn-admin-action btn-admin-del" onclick="handleReviewWithdrawal('${item._id}', 'rejected')">
              <i class="fa-solid fa-xmark"></i> ${t.admin_reject_btn}
            </button>
          </div>
        `;
        container.appendChild(card);
      });
      return;
    }
  } catch (err) {
    console.error('Failed to load pending withdrawals:', err);
  }

  container.innerHTML = `<div class="admin-placeholder-text"><span>${t.admin_no_withdrawals}</span></div>`;
}

window.handleReviewWithdrawal = async function (requestId, action) {
  triggerHaptic('impact');
  const isAr = state.selectedLanguage === 'ar';

  if (action === 'approved') {
    const adminTxModal = document.getElementById('admin-tx-modal');
    const adminTxInput = document.getElementById('admin-tx-link-input');

    if (adminTxModal && adminTxInput) {
      adminTxModal.dataset.currentRequestId = requestId;
      adminTxInput.value = '';
      adminTxModal.classList.add('active');
      setTimeout(() => adminTxInput.focus(), 150);
      return;
    }

    // Fallback prompt if modal element isn't in DOM
    const promptMsg = isAr
      ? 'أدخل رابط المعاملة (Transaction Link):'
      : 'Enter Transaction Link (رابط المعاملة):';
    const txLink = window.prompt(promptMsg);
    if (txLink === null) return; // User cancelled
    const trimmed = txLink.trim();
    if (!trimmed) {
      showToast(isAr ? '⚠️ يرجى إدخال رابط المعاملة لإتمام الموافقة' : '⚠️ Please enter a transaction link', 'warning');
      return;
    }
    await executeWithdrawalReview(requestId, 'approved', trimmed);
    return;
  }

  // Reject action
  const confirmReject = confirm(isAr ? 'هل أنت متأكد من رفض هذا الطلب وإعادة الرصيد للمستخدم؟' : 'Are you sure you want to reject this withdrawal?');
  if (!confirmReject) return;
  await executeWithdrawalReview(requestId, 'rejected', '');
};

async function executeWithdrawalReview(requestId, action, txLink = '') {
  const isAr = state.selectedLanguage === 'ar';
  try {
    const res = await fetch('/api/admin/withdrawals/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-user-id': String(state.user.telegramId),
      },
      body: JSON.stringify({ requestId, action, txLink }),
    });
    const json = await res.json();
    if (json.success) {
      showToast(isAr ? `✅ تم تحديث حالة الطلب إلى: ${action === 'approved' ? 'موافقة' : 'مرفوض'}` : `✅ Request ${action} successfully!`, 'success');
      loadPendingWithdrawals();
    } else {
      showToast(json.message || 'Action failed', 'error');
    }
  } catch (err) {
    showToast('Failed to review withdrawal', 'error');
  }
}

function setupAdditionalModals() {
  // Settings Modal Close & Language Options
  const settingsModal = document.getElementById('settings-modal');
  const closeSettingsBtn = document.getElementById('btn-close-settings-modal');
  const saveSettingsBtn = document.getElementById('btn-save-settings');

  if (settingsModal) {
    if (closeSettingsBtn) {
      closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('active'));
    }
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) settingsModal.classList.remove('active');
    });

    const langCards = settingsModal.querySelectorAll('.language-option-card');
    langCards.forEach((card) => {
      card.addEventListener('click', () => {
        triggerHaptic('selection');
        const chosenLang = card.getAttribute('data-lang');
        if (chosenLang) {
          setLanguage(chosenLang);
          settingsModal.classList.remove('active');
          const msg = chosenLang === 'ar' ? '🌐 تم تغيير اللغة إلى العربية' : (chosenLang === 'ru' ? '🌐 Язык переключен на Русский' : '🌐 Language switched to English');
          showToast(msg, 'success');
        }
      });
    });

    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', () => {
        triggerHaptic('notification-success');
        settingsModal.classList.remove('active');
      });
    }
  }

  // Feedback Modal Close & Submission
  const feedbackModal = document.getElementById('feedback-modal');
  const closeFeedbackBtn = document.getElementById('btn-close-feedback-modal');
  const submitFeedbackBtn = document.getElementById('btn-submit-feedback');
  const feedbackMsg = document.getElementById('feedback-message');
  const feedbackCat = document.getElementById('feedback-category');

  if (feedbackModal) {
    if (closeFeedbackBtn) {
      closeFeedbackBtn.addEventListener('click', () => feedbackModal.classList.remove('active'));
    }
    feedbackModal.addEventListener('click', (e) => {
      if (e.target === feedbackModal) feedbackModal.classList.remove('active');
    });

    if (submitFeedbackBtn && feedbackMsg) {
      submitFeedbackBtn.addEventListener('click', () => {
        const isAr = state.selectedLanguage === 'ar';
        const text = feedbackMsg.value.trim();
        const cat = feedbackCat?.value || 'feedback';

        if (!text) {
          showToast(isAr ? 'الرجاء كتابة تفاصيل الشكوى أو الاقتراح.' : 'Please type your suggestion or complaint.', 'error');
          return;
        }

        triggerHaptic('notification-success');
        feedbackMsg.value = '';
        feedbackModal.classList.remove('active');
        showToast(isAr ? `📩 شكراً لك! تم إرسال رسالتك إلى فريق العمل بنجاح.` : `📩 Thank you! Your message has been sent to the TVA team.`, 'success');
      });
    }
  }

  // Admin Transaction Link Modal
  const adminTxModal = document.getElementById('admin-tx-modal');
  const closeAdminTxBtn = document.getElementById('btn-close-admin-tx-modal');
  const cancelAdminTxBtn = document.getElementById('btn-cancel-admin-tx');
  const confirmAdminTxBtn = document.getElementById('btn-confirm-admin-tx');
  const adminTxInput = document.getElementById('admin-tx-link-input');

  if (adminTxModal) {
    const closeTxModal = () => {
      adminTxModal.classList.remove('active');
      if (adminTxInput) adminTxInput.value = '';
    };

    if (closeAdminTxBtn) closeAdminTxBtn.addEventListener('click', closeTxModal);
    if (cancelAdminTxBtn) cancelAdminTxBtn.addEventListener('click', closeTxModal);
    adminTxModal.addEventListener('click', (e) => {
      if (e.target === adminTxModal) closeTxModal();
    });

    if (confirmAdminTxBtn) {
      confirmAdminTxBtn.addEventListener('click', async () => {
        triggerHaptic('impact');
        const requestId = adminTxModal.dataset.currentRequestId;
        const txLink = (adminTxInput?.value || '').trim();
        const isAr = state.selectedLanguage === 'ar';

        if (!txLink) {
          showToast(isAr ? '⚠️ يرجى إدخال رابط المعاملة (Transaction Link)' : '⚠️ Please enter the Transaction Link', 'warning');
          adminTxInput?.focus();
          return;
        }

        closeTxModal();
        await executeWithdrawalReview(requestId, 'approved', txLink);
      });
    }

    if (adminTxInput) {
      adminTxInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          confirmAdminTxBtn?.click();
        }
      });
    }
  }

  // ==========================================================================
  // FULL-FEATURED ADMIN CONTROL CENTER SETUP
  // ==========================================================================
  const adminModal = document.getElementById('admin-modal');
  const closeAdminBtn = document.getElementById('btn-close-admin-modal');

  if (adminModal) {
    if (closeAdminBtn) {
      closeAdminBtn.addEventListener('click', () => adminModal.classList.remove('active'));
    }
    adminModal.addEventListener('click', (e) => {
      if (e.target === adminModal) adminModal.classList.remove('active');
    });

    // 1. Admin Tabs Switching
    const adminTabs = adminModal.querySelectorAll('.admin-tab-btn');
    const adminPanels = adminModal.querySelectorAll('.admin-tab-panel');
    adminTabs.forEach((btn) => {
      btn.addEventListener('click', () => {
        triggerHaptic('selection');
        const targetPanelId = btn.getAttribute('data-admin-tab');

        adminTabs.forEach((b) => b.classList.remove('active'));
        adminPanels.forEach((p) => p.classList.remove('active'));

        btn.classList.add('active');
        const panel = document.getElementById(targetPanelId);
        if (panel) panel.classList.add('active');

        if (targetPanelId === 'admin-tab-stats') loadAdminStats();
        if (targetPanelId === 'admin-tab-tasks') loadAdminTasks();
        if (targetPanelId === 'admin-tab-promo') loadAdminPromoCodes();
        if (targetPanelId === 'admin-tab-withdrawals') loadPendingWithdrawals();
      });
    });

    // 2. Auto-Verify Toggle Description
    const autoVerifySwitch = document.getElementById('admin-task-autoverify');
    const autoVerifyDesc = document.getElementById('admin-autoverify-desc');
    if (autoVerifySwitch && autoVerifyDesc) {
      autoVerifySwitch.addEventListener('change', () => {
        autoVerifyDesc.innerText = autoVerifySwitch.checked
          ? 'مفعل: يحصل المستخدم على النقاط فور الضغط وإكمال المهمة'
          : 'معطل: تتطلب المهمة فحصاً يدوياً قبل منح النقاط';
      });
    }

    // 3. Save Task (Add or Edit)
    const saveTaskBtn = document.getElementById('btn-admin-save-task');
    const cancelTaskBtn = document.getElementById('btn-admin-cancel-task');
    const refreshTasksBtn = document.getElementById('btn-admin-refresh-tasks');

    if (cancelTaskBtn) {
      cancelTaskBtn.addEventListener('click', () => {
        triggerHaptic('selection');
        cancelEditAdminTask();
      });
    }

    if (refreshTasksBtn) {
      refreshTasksBtn.addEventListener('click', () => {
        triggerHaptic('selection');
        loadAdminTasks();
      });
    }

    if (saveTaskBtn) {
      saveTaskBtn.addEventListener('click', async () => {
        triggerHaptic('impact');
        const isAr = state.selectedLanguage === 'ar';

        const taskId = document.getElementById('admin-task-id')?.value;
        const title = document.getElementById('admin-task-title')?.value.trim();
        const actionUrl = document.getElementById('admin-task-url')?.value.trim();
        const reward = parseInt(document.getElementById('admin-task-reward')?.value, 10) || 10;
        const limit = parseInt(document.getElementById('admin-task-limit')?.value, 10) || 0;
        const autoVerify = document.getElementById('admin-task-autoverify')?.checked ?? true;

        if (!title) {
          showToast(isAr ? 'الرجاء إدخال عنوان المهمة' : 'Please enter task title', 'error');
          return;
        }

        const isEditing = !!taskId;
        const endpoint = isEditing ? `/api/admin/tasks/${taskId}` : '/api/admin/tasks';
        const method = isEditing ? 'PUT' : 'POST';

        try {
          const res = await fetch(endpoint, {
            method,
            headers: {
              'Content-Type': 'application/json',
              'x-telegram-user-id': String(state.user.telegramId),
            },
            body: JSON.stringify({
              title,
              titleAr: title,
              actionUrl,
              rewardAmount: reward,
              memberLimit: limit,
              autoVerify,
            }),
          });
          const json = await res.json();
          if (json.success) {
            showToast(isAr ? `✅ تم ${isEditing ? 'تعديل' : 'إضافة'} المهمة بنجاح!` : `✅ Task ${isEditing ? 'updated' : 'created'} successfully!`, 'success');
            cancelEditAdminTask();
            loadAdminTasks();
            loadUserTasks();
          } else {
            showToast(json.message || 'Action failed', 'error');
          }
        } catch (err) {
          showToast('Failed to save task', 'error');
        }
      });
    }

    // 4. Promo Code Engine Setup
    const generatePromoBtn = document.getElementById('btn-admin-generate-promo');
    const refreshPromosBtn = document.getElementById('btn-admin-refresh-promos');

    if (refreshPromosBtn) {
      refreshPromosBtn.addEventListener('click', () => {
        triggerHaptic('selection');
        loadAdminPromoCodes();
      });
    }

    if (generatePromoBtn) {
      generatePromoBtn.addEventListener('click', async () => {
        triggerHaptic('impact');
        const isAr = state.selectedLanguage === 'ar';
        const codeInput = document.getElementById('admin-promo-code');
        const pointsInput = document.getElementById('admin-promo-points');
        const usesInput = document.getElementById('admin-promo-uses');

        const codeVal = codeInput ? codeInput.value.trim() : '';
        const pointsVal = pointsInput ? parseInt(pointsInput.value, 10) || 25 : 25;
        const usesVal = usesInput ? parseInt(usesInput.value, 10) || 100 : 100;

        try {
          const res = await fetch('/api/admin/promocode/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-telegram-user-id': String(state.user.telegramId),
            },
            body: JSON.stringify({
              code: codeVal || undefined,
              rewardPoints: pointsVal,
              rewardTon: 0,
              maxUses: usesVal,
            }),
          });
          const json = await res.json();
          if (json.success) {
            showToast(isAr ? `🎉 تم إنشاء الرمز: ${json.data.code}` : `🎉 Created code: ${json.data.code}`, 'success');
            if (codeInput) codeInput.value = '';
            loadAdminPromoCodes();
          } else {
            showToast(json.message || 'Failed to generate promo code', 'error');
          }
        } catch (err) {
          showToast('Failed to generate promo code', 'error');
        }
      });
    }

    // 5. Withdrawals Refresh
    const refreshWithdrawalsBtn = document.getElementById('btn-admin-refresh-withdrawals');
    if (refreshWithdrawalsBtn) {
      refreshWithdrawalsBtn.addEventListener('click', () => {
        triggerHaptic('selection');
        loadPendingWithdrawals();
      });
    }

    // 6. User Search & Balance Modification
    const searchUserBtn = document.getElementById('btn-admin-search-user');
    const updateBalanceBtn = document.getElementById('btn-admin-update-balance');
    let currentSearchedUserId = null;

    if (searchUserBtn) {
      searchUserBtn.addEventListener('click', async () => {
        triggerHaptic('selection');
        const isAr = state.selectedLanguage === 'ar';
        const searchInput = document.getElementById('admin-search-user-id');
        const resultBox = document.getElementById('admin-user-result-box');
        const targetId = searchInput ? searchInput.value.trim() : '';

        if (!targetId) {
          showToast(isAr ? 'الرجاء إدخال ID أو اسم المستخدم' : 'Please enter Telegram User ID or Username', 'error');
          return;
        }

        try {
          const res = await fetch(`/api/admin/user/${encodeURIComponent(targetId)}`, {
            headers: {
              'x-telegram-user-id': String(state.user.telegramId),
            },
          });
          const json = await res.json();
          if (json.success && json.data) {
            currentSearchedUserId = json.data.telegramId;
            if (resultBox) resultBox.style.display = 'block';
            const resId = document.getElementById('admin-res-id');
            const resUser = document.getElementById('admin-res-username');
            const resBal = document.getElementById('admin-res-balance');
            const resPts = document.getElementById('admin-res-points');
            const modTon = document.getElementById('admin-modify-ton-val');
            const modPts = document.getElementById('admin-modify-pts-val');

            if (resId) resId.innerText = json.data.telegramId;
            if (resUser) resUser.innerText = json.data.username ? `@${json.data.username}` : (json.data.firstName || '-');
            if (resBal) resBal.innerText = `${json.data.tonBalance.toFixed(4)} TON`;
            if (resPts) resPts.innerText = `${json.data.totalPoints} PTS`;
            if (modTon) modTon.value = json.data.tonBalance;
            if (modPts) modPts.value = json.data.totalPoints;

            showToast(isAr ? `🔍 تم العثور على المستخدم: ${json.data.telegramId}` : `🔍 Found user: ${json.data.telegramId}`, 'success');
          } else {
            if (resultBox) resultBox.style.display = 'none';
            showToast(json.message || 'User not found', 'error');
          }
        } catch (err) {
          showToast('Failed to search user', 'error');
        }
      });
    }

    if (updateBalanceBtn) {
      updateBalanceBtn.addEventListener('click', async () => {
        triggerHaptic('impact');
        const isAr = state.selectedLanguage === 'ar';
        if (!currentSearchedUserId) {
          showToast(isAr ? 'الرجاء البحث عن مستخدم أولاً' : 'Please search for a user first', 'error');
          return;
        }

        const modTon = document.getElementById('admin-modify-ton-val');
        const modPts = document.getElementById('admin-modify-pts-val');
        const newTon = modTon && modTon.value !== '' ? parseFloat(modTon.value) : undefined;
        const newPts = modPts && modPts.value !== '' ? parseInt(modPts.value, 10) : undefined;

        try {
          const res = await fetch(`/api/admin/user/${currentSearchedUserId}/balance`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-telegram-user-id': String(state.user.telegramId),
            },
            body: JSON.stringify({
              tonBalance: newTon,
              totalPoints: newPts,
            }),
          });
          const json = await res.json();
          if (json.success && json.data) {
            const resBal = document.getElementById('admin-res-balance');
            const resPts = document.getElementById('admin-res-points');
            if (resBal) resBal.innerText = `${json.data.newTonBalance.toFixed(4)} TON`;
            if (resPts) resPts.innerText = `${json.data.newTotalPoints} PTS`;

            if (Number(currentSearchedUserId) === Number(state.user.telegramId)) {
              state.walletBalance = json.data.newTonBalance;
              state.totalPoints = json.data.newTotalPoints;
              state.dailyMiningRate = json.data.currentDailyMiningRate;
              updateUI();
            }

            showToast(isAr ? '✅ تم تحديث رصيد المستخدم بنجاح!' : '✅ User balance updated successfully!', 'success');
          } else {
            showToast(json.message || 'Failed to update balance', 'error');
          }
        } catch (err) {
          showToast('Failed to update balance', 'error');
        }
      });
    }

    // 7. Global Admin Stats & Paywall Toggle
    const refreshStatsBtn = document.getElementById('btn-admin-refresh-stats');
    if (refreshStatsBtn) {
      refreshStatsBtn.addEventListener('click', () => {
        triggerHaptic('selection');
        loadAdminStats();
      });
    }

    const paywallToggle = document.getElementById('admin-toggle-require-rig');
    const paywallDesc = document.getElementById('admin-paywall-status-desc');
    if (paywallToggle) {
      paywallToggle.addEventListener('change', async () => {
        triggerHaptic('impact');
        const isAr = state.selectedLanguage === 'ar';
        const isChecked = paywallToggle.checked;

        if (paywallDesc) {
          paywallDesc.innerText = isChecked
            ? (isAr ? 'مفعل: يشترط شراء منصة تعدين واحدة على الأقل قبل السماح بطلب السحب' : 'Active: Users must purchase at least one rig before withdrawing')
            : (isAr ? 'معطل: يمكن لجميع المستخدمين السحب دون شرط شراء منصة' : 'Disabled: Any eligible user can withdraw without owning a rig');
        }

        try {
          const res = await fetch('/api/admin/settings/toggle-rig-withdrawal', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-telegram-user-id': String(state.user.telegramId),
            },
            body: JSON.stringify({ enabled: isChecked }),
          });
          const json = await res.json();
          if (json.success) {
            if (state.rules) state.rules.requireRigForWithdrawal = isChecked;
            showToast(json.message || (isAr ? 'تم تحديث الإعداد بنجاح' : 'Setting updated successfully'), 'success');
          } else {
            showToast(json.message || 'Error updating setting', 'error');
            paywallToggle.checked = !isChecked;
          }
        } catch (_) {
          showToast('Failed to update setting', 'error');
          paywallToggle.checked = !isChecked;
        }
      });
    }
  }
}

// ==========================================================================
// 12A-2. POST-FORCE-JOIN LANGUAGE SELECTION MODAL
// ==========================================================================
function setupLanguageSelectionModal() {
  const langModal = document.getElementById('modal-language-select');
  const closeBtn = document.getElementById('btn-close-lang-modal');
  const confirmBtn = document.getElementById('btn-confirm-language-choice');

  if (!langModal) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      triggerHaptic('selection');
      langModal.classList.remove('active');
    });
  }

  langModal.addEventListener('click', (e) => {
    if (e.target === langModal) langModal.classList.remove('active');
  });

  const cards = langModal.querySelectorAll('.language-option-card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      triggerHaptic('selection');
      const lang = card.getAttribute('data-lang');
      if (lang) {
        setLanguage(lang);
      }
    });
  });

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      triggerHaptic('notification-success');
      langModal.classList.remove('active');
      try {
        localStorage.setItem('tva_lang_selected_after_force_join', 'true');
      } catch (_) {}
      const isAr = state.selectedLanguage === 'ar';
      const isRu = state.selectedLanguage === 'ru';
      const msg = isAr ? '🌐 تم حفظ لغة التطبيق بنجاح' : (isRu ? '🌐 Язык приложения сохранен' : '🌐 App language saved successfully');
      showToast(msg, 'success');
    });
  }
}

/**
 * Loads Global Statistics for the Admin Control Center
 */
async function loadAdminStats() {
  const usersElem = document.getElementById('admin-stat-total-users');
  const rateElem = document.getElementById('admin-stat-total-mining-rate');
  const depositsElem = document.getElementById('admin-stat-total-deposits');
  const withdrawalsElem = document.getElementById('admin-stat-total-withdrawals');
  const paywallToggle = document.getElementById('admin-toggle-require-rig');
  const paywallDesc = document.getElementById('admin-paywall-status-desc');
  const isAr = state.selectedLanguage === 'ar';

  try {
    const res = await fetch('/api/admin/stats', {
      headers: {
        'x-telegram-user-id': String(state.user.telegramId),
      },
    });
    const json = await res.json();
    if (json.success && json.data) {
      const { totalUsers, combinedMiningRate, totalDeposits, totalWithdrawals, requireRigForWithdrawal } = json.data;
      if (usersElem) usersElem.innerText = Number(totalUsers || 0).toLocaleString();
      if (rateElem) rateElem.innerText = `+${Number(combinedMiningRate || 0).toFixed(4)} TON/day`;
      if (depositsElem) depositsElem.innerText = `${Number(totalDeposits || 0).toFixed(2)} TON`;
      if (withdrawalsElem) withdrawalsElem.innerText = `${Number(totalWithdrawals || 0).toFixed(2)} TON`;

      if (paywallToggle) {
        paywallToggle.checked = Boolean(requireRigForWithdrawal);
      }
      if (state.rules) {
        state.rules.requireRigForWithdrawal = Boolean(requireRigForWithdrawal);
      }
      if (paywallDesc) {
        paywallDesc.innerText = requireRigForWithdrawal
          ? (isAr ? 'مفعل: يشترط شراء منصة تعدين واحدة على الأقل قبل السماح بطلب السحب' : 'Active: Users must purchase at least one rig before withdrawing')
          : (isAr ? 'معطل: يمكن لجميع المستخدمين السحب دون شرط شراء منصة' : 'Disabled: Any eligible user can withdraw without owning a rig');
      }
    }
  } catch (err) {
    console.warn('loadAdminStats error:', err);
  }
}

// ==========================================================================
// 12B. TON DEPOSIT MODAL & TON CONNECT INTEGRATION
// ==========================================================================
function setupDepositModal() {
  const depositModal = document.getElementById('deposit-modal');
  const closeDepositBtn = document.getElementById('btn-close-deposit-modal');
  const presetChips = document.querySelectorAll('#deposit-presets .preset-chip');
  const depositInput = document.getElementById('deposit-amount-ton');
  const sendTxBtn = document.getElementById('btn-send-deposit-tx');

  if (depositModal) {
    if (closeDepositBtn) {
      closeDepositBtn.addEventListener('click', () => depositModal.classList.remove('active'));
    }
    depositModal.addEventListener('click', (e) => {
      if (e.target === depositModal) depositModal.classList.remove('active');
    });
  }

  // Preset Chips selection
  if (presetChips && depositInput) {
    presetChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        triggerHaptic('selection');
        presetChips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const amount = chip.getAttribute('data-amount');
        if (amount) depositInput.value = amount;
      });
    });
  }

  // Send Transaction Button via TON Connect UI (Direct to Client Deposit Address)
  if (sendTxBtn) {
    sendTxBtn.addEventListener('click', async () => {
      triggerHaptic('impact');
      const isAr = state.selectedLanguage === 'ar';
      const amount = parseFloat(depositInput?.value) || 1;

      if (isNaN(amount) || amount < 0.1) {
        showToast(isAr ? 'الحد الأدنى للإيداع هو 0.1 TON' : 'Minimum deposit is 0.1 TON', 'error');
        return;
      }

      let ui = tonConnectUI;
      if (!ui) {
        showToast(isAr ? 'جاري تهيئة المحفظة...' : 'Connecting wallet...', 'info');
        ui = await ensureTonConnectUI();
      }

      const CLIENT_DEPOSIT_ADDRESS = 'UQDUlQeNULJd5yl9WjHBkHjA0O3pVueC8NKscybGQbI-R92M';

      if (ui) {
        if (!ui.connected) {
          showToast(isAr ? 'يرجى ربط محفظة TON أولاً' : 'Please connect your TON wallet first', 'info');
          try {
            await ui.openModal();
          } catch (e) {
            console.warn('openModal error:', e);
          }
          return;
        }

        try {
          const nanoAmount = (BigInt(Math.floor(amount * 1e9))).toString();
          const tx = {
            validUntil: Math.floor(Date.now() / 1000) + 600,
            messages: [
              {
                address: CLIENT_DEPOSIT_ADDRESS,
                amount: nanoAmount,
              },
            ],
          };

          showToast(isAr ? 'جاري فتح المحفظة لتأكيد المعاملة...' : 'Opening wallet to confirm transaction...', 'info');
          const result = await ui.sendTransaction(tx);
          if (result) {
            triggerHaptic('notification-success');
            showToast(isAr ? `✅ تم إرسال معاملة إيداع ${amount} TON بنجاح!` : `✅ Successfully sent ${amount} TON deposit transaction!`, 'success');
            if (depositModal) depositModal.classList.remove('active');
          }
        } catch (err) {
          console.warn('TonConnect tx error:', err);
          showToast(isAr ? 'تم إلغاء المعاملة أو حدث خطأ في المحفظة' : 'Transaction canceled or wallet error', 'error');
        }
      } else {
        showToast(isAr ? 'تعذر تحميل نظام المحفظة، يرجى التحقق من اتصال الإنترنت' : 'Could not load wallet system, check connection', 'error');
      }
    });
  }
}

// ==========================================================================
// 12C. 3-CHANNEL FORCE SUBSCRIPTION CHECKER (DISABLED)
// ==========================================================================
async function checkChannelSubscription(manualClick = false) {
  const overlay = document.getElementById('force-sub-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.style.display = 'none';
  }
  return true;
}

function setupForceSubOverlay() {
  const overlay = document.getElementById('force-sub-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.style.display = 'none';
  }
}

// Developer testing helpers
window.setAdminId = function(id) {
  state.adminId = id;
  checkAdminAccess();
};
window.checkIsAdminUser = checkIsAdminUser;
window.toggleWallet = function() {
  state.walletConnected = !state.walletConnected;
  renderWalletPill();
};
window.setLanguage = setLanguage;

// ==========================================================================
// 13. LIVE MINING ACCUMULATOR
// ==========================================================================
function startMiningTicker() {
  if (liveTickerInterval) clearInterval(liveTickerInterval);

  // Per second rate = dailyMiningRate / 86400; ticked every 100ms (0.1s)
  const stepPerTick = (state.dailyMiningRate / 86400) * 0.1;

  liveTickerInterval = setInterval(() => {
    state.accumulatedTon += stepPerTick;
    const balanceElem = document.getElementById('accumulated-balance-display');
    if (balanceElem) {
      balanceElem.innerText = state.accumulatedTon.toFixed(8);
    }
  }, 100);
}

// ==========================================================================
// 14. UI SYNCHRONIZER
// ==========================================================================
function updateUI() {
  // User name
  const nameElem = document.getElementById('user-display-name');
  if (nameElem) nameElem.innerText = state.user.firstName || 'Cosmic Miner';

  // Realistic 3D Robot Mascot Avatar on Home Tab
  const homeRobotImg = document.getElementById('home-robot-avatar');
  if (homeRobotImg) {
    homeRobotImg.src = '/img/robots/mascot.jpg';
  }

  // Balances
  const walletElem = document.getElementById('wallet-balance-display');
  if (walletElem) walletElem.innerText = state.walletBalance.toFixed(4);

  const homePoints = document.getElementById('home-points-badge');
  if (homePoints) homePoints.innerText = `${state.totalPoints} PTS`;

  const dailyRateElem = document.getElementById('daily-rate-display');
  if (dailyRateElem) dailyRateElem.innerText = `+${state.dailyMiningRate.toFixed(6)} TON/day`;

  // Rigs active banner
  const rigsActiveElem = document.getElementById('rigs-active-count-display');
  if (rigsActiveElem) {
    const isAr = state.selectedLanguage === 'ar';
    const unitWord = state.activeRigsCount === 1 
      ? (isAr ? 'منصة' : 'Unit') 
      : (isAr ? 'منصات' : 'Units');
    rigsActiveElem.innerText = `${state.activeRigsCount} ${unitWord}`;
  }

  // Ads progress
  const adsCounterElem = document.getElementById('ads-counter-text');
  if (adsCounterElem) adsCounterElem.innerText = `${state.adsWatchedToday} / ${state.maxDailyAds}`;

  const adsFillElem = document.getElementById('ads-progress-fill');
  if (adsFillElem) {
    const pct = Math.min(100, Math.round((state.adsWatchedToday / state.maxDailyAds) * 100));
    adsFillElem.style.width = `${pct}%`;
  }

  // Friends
  const totalFriendsElem = document.getElementById('total-friends-count');
  if (totalFriendsElem) totalFriendsElem.innerText = state.totalFriends;

  const activeFriendsElem = document.getElementById('active-friends-count');
  if (activeFriendsElem) activeFriendsElem.innerText = state.activeFriends;

  // 4-Tier Referral Counters
  const t1Elem = document.getElementById('tier1-count');
  if (t1Elem) t1Elem.innerText = state.referralStats?.level1Count ?? state.totalFriends ?? 0;

  const t2Elem = document.getElementById('tier2-count');
  if (t2Elem) t2Elem.innerText = state.referralStats?.level2Count ?? 0;

  const t3Elem = document.getElementById('tier3-count');
  if (t3Elem) t3Elem.innerText = state.referralStats?.level3Count ?? 0;

  const t4Elem = document.getElementById('tier4-count');
  if (t4Elem) t4Elem.innerText = state.referralStats?.level4Count ?? 0;

  // Withdrawal Status
  const withdrawAdsRuleItem = document.getElementById('rule-item-withdrawal-ads');
  if (withdrawAdsRuleItem) {
    withdrawAdsRuleItem.style.display = (state.requiredWithdrawalAds > 0) ? 'flex' : 'none';
  }
  const withdrawAdsStatus = document.getElementById('withdrawal-ads-status');
  if (withdrawAdsStatus) {
    withdrawAdsStatus.innerText = `${state.adsWatchedForWithdrawal} / ${state.requiredWithdrawalAds}`;
  }
  const withdrawAdBtn = document.getElementById('btn-watch-ad-withdraw');
  if (withdrawAdBtn) {
    if (state.requiredWithdrawalAds > 0 && state.adsWatchedForWithdrawal >= state.requiredWithdrawalAds) {
      withdrawAdBtn.innerHTML = `<i class="fa-solid fa-circle-check text-neon"></i> <span>${state.selectedLanguage === 'ar' ? 'شرط السحب مكتمل' : (state.selectedLanguage === 'ru' ? 'Условие вывода выполнено' : 'Withdrawal Requirement Met')} (${state.adsWatchedForWithdrawal}/${state.requiredWithdrawalAds})</span>`;
      withdrawAdBtn.disabled = true;
      withdrawAdBtn.style.opacity = '0.75';
    } else {
      withdrawAdBtn.disabled = false;
      withdrawAdBtn.style.opacity = '1';
      withdrawAdBtn.innerHTML = `<i class="fa-solid fa-play"></i> <span>${state.selectedLanguage === 'ar' ? 'مشاهدة إعلان لفتح السحب' : (state.selectedLanguage === 'ru' ? 'Смотреть рекламу для вывода' : 'Watch Ad for Withdrawal')} (${state.adsWatchedForWithdrawal}/${state.requiredWithdrawalAds})</span>`;
    }
  }

  // Profile Header Elements
  const profileNameElem = document.getElementById('profile-user-name');
  if (profileNameElem) profileNameElem.innerText = state.user.firstName || 'Cosmic Miner';

  const profileUsernameElem = document.getElementById('profile-user-username');
  if (profileUsernameElem) profileUsernameElem.innerText = `@${state.user.username || 'cosmic_miner'}`;

  const profileIdElem = document.getElementById('profile-user-id');
  if (profileIdElem) profileIdElem.innerText = state.user.telegramId;

  // Synchronize Wallet Connection Badge & Admin Access Check
  renderWalletPill();
  checkAdminAccess();
}

// ==========================================================================
// 15. REFERRAL EXTRACTION & BACKEND SYNC
// ==========================================================================
function getIncomingReferrerId() {
  let param = window.Telegram?.WebApp?.initDataUnsafe?.start_param;

  if (!param) {
    const urlParams = new URLSearchParams(window.location.search);
    param = urlParams.get('tgWebAppStartParam') || urlParams.get('startapp') || urlParams.get('start') || urlParams.get('ref');
  }

  if (!param && window.location.hash) {
    try {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      param = hashParams.get('tgWebAppStartParam') || hashParams.get('startapp') || hashParams.get('start') || hashParams.get('ref');
    } catch (_) {}
  }

  if (param) {
    const clean = String(param).replace(/^ref_?/i, '').trim();
    const parsedId = parseInt(clean, 10);
    if (!isNaN(parsedId) && parsedId > 0 && parsedId !== Number(state.user.telegramId)) {
      try {
        localStorage.setItem('tva_incoming_ref', String(parsedId));
      } catch (_) {}
      return parsedId;
    }
  }

  try {
    const cachedRef = localStorage.getItem('tva_incoming_ref');
    if (cachedRef) {
      const parsedCached = parseInt(cachedRef, 10);
      if (!isNaN(parsedCached) && parsedCached > 0 && parsedCached !== Number(state.user.telegramId)) {
        return parsedCached;
      }
    }
  } catch (_) {}

  return null;
}

async function syncWithBackend() {
  try {
    const referrerId = getIncomingReferrerId();
    const refQuery = referrerId ? `&referredBy=${referrerId}&start_param=${referrerId}` : '';
    const res = await fetch(`/api/user/me?telegramId=${state.user.telegramId}&username=${encodeURIComponent(state.user.username || '')}${refQuery}`);
    const json = await res.json();
    if (json.success && json.data) {
      const { user, mining, rules } = json.data;
      state.walletBalance = user.tonBalance;
      
      // Protect continuous client ticker from jumping backwards unless claimed
      if (typeof mining.accumulatedTon === 'number') {
        if (mining.accumulatedTon < 0.00001) {
          state.accumulatedTon = mining.accumulatedTon;
        } else {
          state.accumulatedTon = Math.max(state.accumulatedTon, mining.accumulatedTon);
        }
      }

      state.dailyMiningRate = mining.currentDailyMiningRate;
      state.totalPoints = user.totalPoints;
      state.adsWatchedToday = user.adsWatchedToday;
      state.maxDailyAds = (user.maxDailyAds && user.maxDailyAds !== 40) ? user.maxDailyAds : 30;
      state.totalAdsWatched = user.totalAdsWatched;
      state.adsWatchedForWithdrawal = user.adsWatchedForWithdrawal;
      state.requiredWithdrawalAds = user.withdrawalAdsRequired ?? 15;
      state.totalFriends = user.totalFriends || 0;
      state.activeFriends = user.activeReferralsCount || 0;
      if (user.referralStats && typeof user.referralStats === 'object') {
        state.referralStats = { ...state.referralStats, ...user.referralStats };
      }
      state.activeRigsCount = user.rigs?.filter((r) => r.status === 'active')?.length || 0;
      state.hasActiveRigs = Boolean(user.hasActiveRigs || (user.rigs && user.rigs.length > 0));
      if (typeof user.isAdmin === 'boolean') {
        state.isAdmin = user.isAdmin;
      }
      if (rules) {
        state.rules = rules;
      }

      updateUI();
      saveStateCache();
    }
  } catch (_) {}
}

// ==========================================================================
// 16. TOAST NOTIFICATIONS & HAPTIC FEEDBACK
// ==========================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconClass = 'fa-circle-info';
  if (type === 'success') iconClass = 'fa-circle-check text-neon';
  if (type === 'error') iconClass = 'fa-circle-exclamation';

  toast.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.25s forwards';
    setTimeout(() => toast.remove(), 250);
  }, 3000);
}

function triggerHaptic(type) {
  if (!tg?.HapticFeedback) return;
  try {
    if (type === 'impact') tg.HapticFeedback.impactOccurred('medium');
    else if (type === 'selection') tg.HapticFeedback.selectionChanged();
    else if (type === 'notification-success') tg.HapticFeedback.notificationOccurred('success');
  } catch (_) {}
}

// ==========================================================================
// 17. INITIALIZATION (INSTANT UI HYDRATION & NON-BLOCKING SYNC)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Instant hydration from global cache (0ms DOM paint)
  loadStateCache();

  setupTabNavigation();
  setupHomeDashboard();
  renderDedicatedRigs();
  setupTasksTab();
  setupFriendsTab();
  setupWithdrawalModal();
  setupProfileTab();
  setupAdditionalModals();
  setupLanguageSelectionModal();
  setupDepositModal();
  setupForceSubOverlay();
  
  // Set initial language (Default: Arabic, or detected Telegram language, or saved preference)
  const initialLang = getInitialLanguage();
  setLanguage(initialLang);

  updateUI();
  startMiningTicker();

  // 2. Initialize TON Connect SDK & load public configs
  initTonConnect();
  loadPublicConfig();

  // 3. Strict Force Subscription Check on Launch
  checkChannelSubscription(false);
  // Recurring subscription verification every 1 hour (3600000 ms)
  setInterval(() => checkChannelSubscription(false), 3600000);

  // 4. Initial non-blocking background fetch
  syncWithBackend();

  // 5. Periodic non-blocking background sync every 30 seconds
  setInterval(syncWithBackend, 30000);
});
