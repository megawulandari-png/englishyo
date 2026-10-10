/* THE BRAVE WAY — LEARN YO! modules. Text is [Bahasa Indonesia, English]. */
window.AB = window.AB || {};
const MF2 = [["Mitos","Myth"],["Fakta","Fact"]];
AB.modules = [
{ id:1, icon:"🔍", color:"#1456d8",
  title:["Kenali Risiko","Know the Risks"],
  blurb:["Mengapa pencegahan penting, dan apa yang harus dilakukan saat ada tawaran tak dikenal.","Why prevention matters, and what to do with unknown offers."],
  goals:[["Memahami pentingnya mencegah penyalahgunaan narkoba","Understand why preventing drug misuse matters"],["Mengenali tawaran yang tidak aman","Recognise unsafe offers"],["Memahami bahwa zat tak dikenal berisiko","Know that unknown substances can be risky"],["Mengetahui tindakan aman","Know the safe actions"]],
  cards:[
   {e:"💙",t:["Mencegah Itu Peduli","Prevention Is Caring"],d:["Mencegah penyalahgunaan narkoba melindungi kesehatan, cita-cita, dan kehidupan sekolahmu.","Preventing drug misuse protects your health, your dreams and your school life."],x:["\"Aku belajar fakta dulu sebelum memutuskan.\"","\"I learn the facts before I decide.\""]},
   {e:"❓",t:["Tak Dikenal = Jangan Dicoba","Unknown Means Don't Try"],d:["Pil, minuman, bubuk, atau produk yang tidak kamu kenal bisa berisiko. Kamu tidak bisa tahu aman atau tidak hanya dengan melihat, mencium, atau mencicipi.","Pills, drinks, powders or products you do not know can be risky. You cannot tell if they are safe by looking, smelling or tasting."],x:["\"Aku tidak tahu itu apa, jadi aku tidak mau.\"","\"I don't know what it is, so I won't take it.\""]},
   {e:"🚩",t:["Tanda Tawaran Tidak Aman","Signs of an Unsafe Offer"],d:["Waspadai: disuruh merahasiakan, dipaksa cepat-cepat, \"gratis khusus untukmu\", tanpa label jelas, dan terus membujuk saat kamu menolak.","Watch for: being told to keep it secret, being rushed, \"free just for you\", no clear label, and pushing after you say no."],x:["\"Jangan bilang ke siapa-siapa ya.\" → Itu tanda bahaya!","\"Don't tell anyone.\" → That is a red flag!"]},
   {e:"💊",t:["Obat Hanya dari Orang Tepercaya","Medicine Only From Trusted People"],d:["Obat aman jika diberikan orang tua, dokter, atau apoteker untuk dirimu dan diminum sesuai aturan. Jangan memakai obat milik orang lain atau dari orang yang tidak jelas.","Medicine is safe when a parent, doctor or pharmacist gives it to you and you follow the directions. Do not use someone else's medicine or anything from an unclear source."],x:["\"Aku hanya minum obat dari Ibu atau dokter.\"","\"I only take medicine from my mum or a doctor.\""]},
   {e:"🛡️",t:["Tindakan Aman","Safe Actions"],d:["Tolak dengan tegas, menjauh, tetap dekat orang yang kamu percaya, lalu beri tahu orang dewasa tepercaya. Jangan menyelidiki atau menghadapi sendiri.","Say no firmly, step away, stay near people you trust, then tell a trusted adult. Do not investigate or confront on your own."],x:["\"Aku menolak, pergi, lalu cerita ke guru.\"","\"I say no, leave, then tell my teacher.\""]}],
  acts:[
   {title:["Mitos atau Fakta?","Myth or Fact?"],type:"mcq",items:[
     {q:["Kalau teman yang menawari, pasti aman.","If a friend offers it, it must be safe."],opts:MF2,ok:0,why:["Mitos. Teman pun bisa keliru atau tidak tahu isinya.","Myth. Even friends can be wrong or not know what is inside."]},
     {q:["Kita bisa tahu sesuatu aman hanya dengan melihatnya.","You can tell something is safe just by looking at it."],opts:MF2,ok:0,why:["Mitos. Penampilan tidak menunjukkan keamanan.","Myth. Appearance does not show safety."]},
     {q:["Boleh menolak, bahkan kepada orang yang lebih tua atau populer.","It is okay to say no, even to someone older or popular."],opts:MF2,ok:1,why:["Fakta. Kamu berhak menolak.","Fact. You have the right to refuse."]},
     {q:["Memberi tahu orang dewasa tepercaya tentang tawaran tidak aman adalah langkah cerdas dan berani.","Telling a trusted adult about an unsafe offer is smart and brave."],opts:MF2,ok:1,why:["Fakta. Melapor melindungi dirimu dan orang lain.","Fact. Reporting protects you and others."]},
     {q:["Kita sebaiknya menyelidiki diam-diam siapa yang menjual di sekolah.","We should secretly investigate who is selling at school."],opts:MF2,ok:0,why:["Mitos. Itu tugas orang dewasa. Cukup laporkan.","Myth. That is the adults' job. Just report it."]}]},
   {title:["Kuis Cepat","Quick Quiz"],type:"mcq",items:[
     {q:["Seseorang yang tidak terlalu kamu kenal menawarkan pil \"agar kuat belajar\". Langkah terbaik?","Someone you hardly know offers a pill \"to help you study\". Best step?"],opts:[["Mengambil setengah saja","Take half"],["Menolak, menjauh, lalu cerita ke orang dewasa","Refuse, leave, then tell an adult"],["Minta dia membuktikan aman","Ask them to prove it's safe"]],ok:1,why:["Menolak dan memberi tahu orang dewasa adalah yang paling aman.","Refusing and telling an adult is the safest."]},
     {q:["Mana yang merupakan tanda bahaya?","Which one is a warning sign?"],opts:[["Obat dari dokter untukmu","Medicine from a doctor for you"],["\"Rahasiakan ini dari orang tuamu.\"","\"Keep this secret from your parents.\""],["Roti di kantin berlabel harga","Bread in the canteen with a price tag"]],ok:1,why:["Meminta merahasiakan dari orang dewasa adalah tanda bahaya.","Asking for secrecy from adults is a red flag."]},
     {q:["Siapa yang bisa membantumu?","Who can help you?"],opts:[["Orang tua, guru, atau guru BK","Parents, teachers or the school counselor"],["Hanya orang asing di internet","Only strangers on the internet"],["Tidak ada siapa pun","Nobody"]],ok:0,why:["Orang dewasa tepercaya siap membantumu.","Trusted adults are ready to help you."]}]}],
  sum:[["Pencegahan adalah bentuk kepedulian pada dirimu.","Prevention is a way of caring for yourself."],["Benda atau zat yang tidak dikenal tidak boleh dicoba.","Never try unknown items or substances."],["Tolak, menjauh, dan beri tahu orang dewasa tepercaya.","Refuse, step away and tell a trusted adult."]]},

{ id:2, icon:"🗣️", color:"#ff8a1f",
  title:["Berani Menolak","Brave to Say No"],
  blurb:["Mengenali tekanan teman dan berlatih menolak dengan tegas dan sopan.","Spot peer pressure and practise refusing firmly and politely."],
  goals:[["Memahami tekanan teman","Understand peer pressure"],["Berlatih komunikasi asertif","Practise assertive communication"],["Berani mengatakan tidak","Say no with confidence"],["Mengetahui hak untuk menolak","Know your right to refuse"]],
  cards:[
   {e:"👥",t:["Apa Itu Tekanan Teman?","What Is Peer Pressure?"],d:["Teman bisa memengaruhi kita. Tekanan teman bisa positif (mengajak belajar) atau negatif (mengajak melanggar aturan atau melakukan hal tidak aman).","Friends can influence us. Peer pressure can be positive (studying together) or negative (pushing you to break rules or do something unsafe)."],x:["\"Kalau berani, ikut dong!\" → Itu tekanan negatif.","\"If you're brave, join us!\" → That is negative pressure."]},
   {e:"✋",t:["Kamu Berhak Menolak","You Have the Right to Refuse"],d:["Kamu boleh berkata tidak pada ajakan yang tidak aman, kapan saja dan kepada siapa saja. Keputusan atas dirimu ada padamu.","You may say no to unsafe invitations at any time and to anyone. Decisions about you belong to you."],x:["\"Ini badanku dan pilihanku.\"","\"This is my body and my choice.\""]},
   {e:"💪",t:["Asertif: Jelas, Tenang, Sopan","Assertive: Clear, Calm, Polite"],d:["Asertif berbeda dari pasif (diam, menyerah) dan agresif (kasar). Gunakan suara mantap, tatap lawan bicara, dan bicara singkat.","Assertive is different from passive (silent, giving in) and aggressive (rude). Use a steady voice, look at the person and keep it short."],x:["Pasif: \"Hmm… ya sudah.\" Agresif: \"Kalian bodoh!\" Asertif: \"Tidak, terima kasih.\"","Passive: \"Hmm… fine.\" Aggressive: \"You're stupid!\" Assertive: \"No, thank you.\""]},
   {e:"💬",t:["Kalimat Penolakan","Refusal Phrases"],d:["Siapkan kalimat-kalimat ini supaya kamu tidak bingung saat ditekan.","Get these ready so you are not stuck when pressured."],phrases:true},
   {e:"🌈",t:["Cari Lingkungan yang Positif","Find a Positive Circle"],d:["Teman sejati menghormati keputusanmu. Jika tekanan berlanjut, pergilah dan bergabung dengan kegiatan serta teman yang positif.","True friends respect your decisions. If pressure continues, leave and join positive activities and friends."],x:["\"Aku mau latihan basket. Mau ikut?\"","\"I'm off to basketball practice. Want to join?\""]}],
  phrases:[
   [["Tidak, terima kasih. Aku tidak mau.","No, thank you. I don't want to."]],
   [["Aku tidak tertarik.","I'm not interested."]],
   [["Aku lebih suka melakukan hal lain.","I'd rather do something else."]],
   [["Tolong jangan paksa aku.","Please don't pressure me."]],
   [["Aku harus pergi sekarang.","I need to leave now."]]],
  acts:[
   {title:["Penyusun Dialog","Dialogue Builder"],type:"build",
    lines:[["bayu",["Ayo coba sekali saja. Semua orang juga melakukannya!","Come on, just try it once. Everybody does it!"]]],
    steps:[
     {label:["1. Katakan \"tidak\" dengan jelas","1. Say \"no\" clearly"],opts:[
       {t:["Tidak, terima kasih. Aku tidak mau.","No, thank you. I don't want to."],ok:true},
       {t:["Hmm… mungkin lain kali.","Hmm… maybe next time."],ok:false,why:["Kata \"mungkin\" membuat mereka terus membujuk.","\"Maybe\" makes them keep pushing."]},
       {t:["Ya sudah, sekali saja.","Okay, just once."],ok:false,why:["Itu berarti kamu menyerah.","That means you give in."]}]},
     {label:["2. Tetap tenang, beri alasan atau alternatif","2. Stay calm, give a reason or alternative"],opts:[
       {t:["Aku lebih suka melakukan hal lain.","I'd rather do something else."],ok:true},
       {t:["Kamu menyebalkan sekali!","You are so annoying!"],ok:false,why:["Kata kasar membuat suasana makin tegang.","Rude words make things more tense."]},
       {t:["Entahlah, menurutmu bagaimana?","I'm not sure, what do you think?"],ok:false,why:["Ragu-ragu mengundang bujukan lagi.","Hesitating invites more pushing."]}]},
     {label:["3. Jika terus dipaksa","3. If they keep pushing"],opts:[
       {t:["Tolong jangan paksa aku. Aku harus pergi sekarang.","Please don't pressure me. I need to leave now."],ok:true},
       {t:["Baiklah, kamu menang.","Fine, you win."],ok:false,why:["Menyerah membuat pilihanmu diabaikan.","Giving in means your choice is ignored."]},
       {t:["Aku akan membalasmu nanti!","I'll get back at you later!"],ok:false,why:["Mengancam bukan asertif dan bisa berbahaya.","Threatening is not assertive and can be dangerous."]}]}]}],
  sum:[["Tekanan teman bisa positif atau negatif.","Peer pressure can be positive or negative."],["Kamu berhak menolak dengan jelas, tenang, dan sopan.","You have the right to refuse clearly, calmly and politely."],["Jika terus dipaksa, pergi dan cari orang atau kegiatan yang positif.","If pushed again and again, leave and find positive people or activities."]]},

{ id:3, icon:"🤝", color:"#12b5a5",
  title:["Berani Melapor dan Mencari Bantuan","Speak Up & Get Help"],
  blurb:["Kapan harus meminta bantuan, siapa orang dewasa tepercaya, dan cara membantu teman tanpa menghakimi.","When to ask for help, who trusted adults are, and how to support friends without judging."],
  goals:[["Mengenali situasi yang butuh orang dewasa","Recognise situations that need an adult"],["Mengenal orang dewasa tepercaya","Identify trusted adults"],["Berlatih meminta bantuan","Practise asking for help"],["Mendukung teman tanpa menghakimi","Support friends without judgment"]],
  cards:[
   {e:"🆘",t:["Kapan Harus Meminta Bantuan?","When to Ask for Help"],d:["Saat ada tawaran tidak aman, pesan yang mencurigakan, teman yang dalam bahaya, atau ketika kamu merasa takut dan bingung.","When there is an unsafe offer, a suspicious message, a friend in danger, or when you feel scared or unsure."],x:["\"Aku merasa tidak nyaman, aku perlu bicara dengan orang dewasa.\"","\"I feel uncomfortable, I need to talk to an adult.\""]},
   {e:"👩‍🏫",t:["Orang Dewasa Tepercaya","Trusted Adults"],d:["Orang tua atau wali, guru, guru BK, dan pihak sekolah yang tepat. Pilih orang yang membuatmu merasa aman dan didengarkan.","Parents or guardians, teachers, school counselors and appropriate school staff. Choose people who make you feel safe and listened to."],x:["Tulis 3 orang dewasa yang bisa kamu percaya.","Think of 3 adults you could trust."]},
   {e:"🗨️",t:["Cara Meminta Bantuan","How to Ask for Help"],d:["Pilih waktu yang tenang, ceritakan apa yang kamu lihat atau dengar, lalu tanyakan apa yang harus dilakukan.","Pick a calm moment, say what you saw or heard, then ask what to do."],x:["\"Bu, boleh saya bicara? Ada hal yang membuat saya khawatir.\"","\"Miss, may I talk to you? Something is worrying me.\""]},
   {e:"🚫",t:["Jangan Menyelidiki Sendiri","Don't Investigate Alone"],d:["Jika kamu curiga ada kegiatan terkait narkoba, jangan mengintai, mengejar, atau menghadapi orang itu. Keselamatanmu nomor satu. Orang dewasa yang menanganinya.","If you suspect drug-related activity, do not spy, follow or confront anyone. Your safety comes first. Adults handle it."],x:["Tugasmu: menjauh dan melapor.","Your job: step away and report."]},
   {e:"💛",t:["Mendukung Teman Tanpa Menghakimi","Support Friends Without Judging"],d:["Dengarkan, ucapkan terima kasih atas kepercayaannya, jangan menebak-nebak atau menggosip, dan ajak ia bicara dengan orang dewasa tepercaya.","Listen, thank them for trusting you, don't guess or gossip, and invite them to talk to a trusted adult."],x:["\"Aku di sini. Mau kutemani ke guru BK?\"","\"I'm here. Shall I go with you to the counselor?\""]}],
  acts:[
   {title:["Pasangkan Situasi dan Tindakan","Match Situation and Action"],type:"match",
    pairs:[
     {a:["Orang asing menawarkan pil tak dikenal","A stranger offers an unknown pill"],b:["Tolak, menjauh, beri tahu guru","Say no, leave, tell a teacher"]},
     {a:["Pesan menyuruhmu merahasiakan sesuatu dari orang tua","A message tells you to hide something from your parents"],b:["Tunjukkan kepada orang tua atau guru","Show it to a parent or teacher"]},
     {a:["Temanmu tampak sangat stres dan sedih","Your friend seems very stressed and sad"],b:["Dengarkan dan sarankan guru BK","Listen and suggest the counselor"]},
     {a:["Kamu menemukan bungkusan aneh di sekolah","You find a strange packet at school"],b:["Jangan sentuh; lapor ke guru atau satpam","Don't touch it; tell a teacher or guard"]},
     {a:["Seseorang terus menekanmu berkali-kali","Someone keeps pressuring you again and again"],b:["Pergi dan ceritakan kepada orang dewasa","Leave and tell a trusted adult"]}]}],
  sum:[["Meminta bantuan orang dewasa tepercaya adalah tindakan berani.","Asking a trusted adult for help is brave."],["Jangan menyelidiki atau menghadapi orang lain sendirian.","Never investigate or confront people on your own."],["Dukung temanmu dengan mendengarkan, bukan menghakimi.","Support friends by listening, not judging."]]},

{ id:4, icon:"💪", color:"#2fa84f",
  title:["Kebiasaan Sehat, Masa Depan Hebat","Healthy Hero Habits"],
  blurb:["Kebiasaan sehat, konsep diri positif, pengendalian diri, mengelola emosi, dan pertemanan yang saling mendukung.","Healthy habits, positive self-concept, self-control, managing emotions and supportive friendships."],
  goals:[["Membangun kebiasaan sehat","Build healthy habits"],["Memiliki konsep diri positif","Grow a positive self-concept"],["Melatih pengendalian diri","Practise self-regulation"],["Mengelola emosi dengan baik","Manage emotions well"],["Memilih teman yang mendukung","Choose supportive friends"]],
  cards:[
   {e:"🥗",t:["Hidup Bersih dan Sehat","Healthy Living"],d:["Tidur cukup, makan seimbang, minum air, berolahraga, dan menjaga kebersihan membuat tubuh dan pikiran kuat.","Enough sleep, balanced meals, water, exercise and cleanliness keep your body and mind strong."],x:["\"Aku tidur lebih awal supaya segar saat ujian.\"","\"I sleep early so I feel fresh for the test.\""]},
   {e:"🌟",t:["Konsep Diri Positif","Positive Self-Concept"],d:["Kenali kelebihanmu. Kamu lebih dari nilai atau kesalahanmu, dan kamu bisa terus belajar dan tumbuh.","Know your strengths. You are more than your grades or mistakes, and you can keep learning and growing."],x:["\"Aku pandai menggambar dan aku sedang belajar matematika.\"","\"I'm good at drawing and I'm learning maths.\""]},
   {e:"⏸️",t:["Kendali Diri: STOP","Self-Control: STOP"],d:["S: Berhenti sejenak. T: Tarik napas. O: Observasi perasaanmu. P: Pilih langkah yang aman.","S: Stop for a moment. T: Take a breath. O: Observe your feelings. P: Pick a safe next step."],x:["\"Aku marah, jadi aku tarik napas tiga kali dulu.\"","\"I'm angry, so I take three breaths first.\""]},
   {e:"🎨",t:["Mengelola Stres dengan Aman","Handling Stress Safely"],d:["Bercerita, berolahraga, musik, seni, istirahat, atau meminta bantuan guru BK. Jangan menyimpan beban sendirian.","Talk it out, exercise, music, art, rest, or ask the counselor for help. Don't carry the load alone."],x:["\"Aku stres, jadi aku jalan sore dan cerita ke Ibu.\"","\"I'm stressed, so I take an evening walk and talk to Mum.\""]},
   {e:"🤗",t:["Pertemanan yang Mendukung","Supportive Friendships"],d:["Teman yang baik menghargai, jujur, dan mengajak ke hal positif. Kamu juga bisa menjadi teman yang baik bagi orang lain.","Good friends respect you, are honest and invite you to positive things. You can be a good friend too."],x:["\"Yuk, belajar bareng lalu main bola!\"","\"Let's study together, then play football!\""]}],
  acts:[
   {title:["Pilihan Sehat vs Pilihan Berisiko","Healthy Choices vs Risky Choices"],type:"sort",
    bins:[["Pilihan sehat","Healthy choices"],["Pilihan berisiko","Risky choices"]],
    items:[
     {t:["Tidur lebih awal sebelum ujian","Sleep early before a test"],bin:0},
     {t:["Bermain sepak bola sepulang sekolah","Play football after school"],bin:0},
     {t:["Bercerita ke guru BK saat stres","Talk to the counselor when stressed"],bin:0},
     {t:["Bergabung dengan klub seni","Join the art club"],bin:0},
     {t:["Begadang tiap malam","Stay up late every night"],bin:1,why:["Kurang tidur membuat sulit mengendalikan emosi.","Too little sleep makes it hard to control emotions."]},
     {t:["Memendam masalah dan tidak cerita ke siapa pun","Hide worries and tell nobody"],bin:1,why:["Beban yang dipendam makin berat. Bercerita itu membantu.","Hidden worries get heavier. Talking helps."]},
     {t:["Ikut teman yang menantang melanggar aturan","Follow friends who dare you to break rules"],bin:1,why:["Ikut-ikutan melanggar aturan itu berisiko.","Going along with rule-breaking is risky."]},
     {t:["Memakai obat tak dikenal \"supaya rileks\"","Take unknown pills \"to relax\""],bin:1,why:["Zat tak dikenal berisiko. Pilih cara sehat untuk rileks.","Unknown substances are risky. Choose healthy ways to relax."]}]}],
  sum:[["Tidur, makan sehat, bergerak, dan hobi positif menjaga kekuatanmu.","Sleep, healthy food, movement and positive hobbies keep you strong."],["Gunakan STOP saat emosi kuat.","Use STOP when feelings are strong."],["Bercerita dan meminta bantuan adalah cara sehat mengelola stres.","Talking and asking for help are healthy ways to handle stress."]]},

{ id:5, icon:"🏫", color:"#ff5c93",
  title:["Bersama Ciptakan Sekolah Bersinar","Together We Build a Shining School"],
  blurb:["Pencegahan adalah kerja sama: kegiatan positif, lingkungan aman, dan empati.","Prevention is teamwork: positive activities, a safe environment and empathy."],
  goals:[["Memahami pentingnya pencegahan","Understand why prevention matters"],["Ikut kegiatan positif di sekolah","Join positive school activities"],["Menciptakan lingkungan yang aman","Create a safe, supportive environment"],["Mengembangkan empati dan tanggung jawab sosial","Build empathy and social responsibility"]],
  cards:[
   {e:"🤝",t:["Pencegahan Itu Kerja Tim","Prevention Is Teamwork"],d:["Keluarga, sekolah, dan teman saling menjaga. Kita semua punya peran untuk menciptakan sekolah yang aman.","Family, school and friends look after each other. We all have a role in a safe school."],x:["\"Aku bantu menjaga sekolah kita tetap aman.\"","\"I help keep our school safe.\""]},
   {e:"⚽",t:["Kegiatan Positif","Positive Activities"],d:["Olahraga, seni, pramuka, literasi, sains, atau relawan membuat kita sibuk dengan hal yang bermanfaat dan menemukan teman baik.","Sports, arts, scouts, reading, science or volunteering keep us busy with useful things and help us find good friends."],x:["\"Aku ikut klub literasi dan lomba poster.\"","\"I joined the reading club and the poster contest.\""]},
   {e:"🌈",t:["Lingkungan Aman dan Inklusif","A Safe and Inclusive School"],d:["Hormati semua orang, hentikan perundungan, dan jangan melabeli teman. Orang yang sedang kesulitan butuh dukungan, bukan hinaan.","Respect everyone, stop bullying and don't label classmates. People having a hard time need support, not insults."],x:["\"Kita tidak menertawakan teman. Kita membantu.\"","\"We don't laugh at classmates. We help.\""]},
   {e:"📣",t:["Pesan Kampanye yang Baik","Good Campaign Messages"],d:["Pesan yang baik bersifat positif, akurat, dan mengajak. Hindari pesan yang menakut-nakuti atau menyalahkan orang tertentu.","Good messages are positive, accurate and inviting. Avoid scaring people or blaming particular people."],x:["\"Berani Menolak, Berani Melapor!\"","\"Brave to say no, brave to speak up!\""]},
   {e:"🌟",t:["Jadilah Juara THE BRAVE WAY","Be a BRAVE WAY Champion"],d:["Tindakan kecil seperti menyapa, mendengarkan, dan berani menolak bisa menyinari sekolahmu.","Small actions like greeting, listening and saying no can make your school shine."],x:["\"Satu tindakan baik hari ini untuk sekolahku.\"","\"One kind action today for my school.\""]}],
  acts:[
   {title:["Pilih Slogan Poster","Choose Poster Slogans"],type:"select",style:"chips",q:["Pilih semua slogan yang positif dan tidak menyalahkan.","Choose all slogans that are positive and don't blame anyone."],
    items:[
     {t:["Berani Menolak, Berani Melapor!","Brave to Say No, Brave to Speak Up!"],ok:true},
     {t:["Teman sehat, masa depan hebat!","Healthy friends, a great future!"],ok:true},
     {t:["Bersama kita bersinar dan aman!","Together we shine and stay safe!"],ok:true},
     {t:["Mereka itu berbahaya, jauhi mereka!","They are dangerous, stay away from them!"],ok:false,why:["Melabeli membuat orang takut mencari bantuan.","Labelling makes people afraid to seek help."]},
     {t:["Siapa yang salah akan dipermalukan!","Anyone at fault will be shamed!"],ok:false,why:["Mempermalukan tidak membantu.","Shaming does not help."]}]},
   {title:["Pilih Kegiatan Positif","Choose Positive Activities"],type:"select",style:"chips",q:["Pilih semua kegiatan yang membangun sekolah yang aman.","Choose all the activities that build a safe school."],
    items:[
     {t:["Turnamen olahraga persahabatan","Friendly sports tournament"],ok:true},
     {t:["Lomba mural dan poster","Mural and poster contest"],ok:true},
     {t:["Klub baca dan komunitas hobi","Reading club and hobby communities"],ok:true},
     {t:["Mengintai teman yang dicurigai","Spying on suspected classmates"],ok:false,why:["Mengintai merusak kepercayaan dan tidak aman.","Spying damages trust and is unsafe."]},
     {t:["Membuat daftar \"anak bermasalah\"","Making a list of \"problem kids\""],ok:false,why:["Daftar seperti ini menstigma dan tidak adil.","Lists like this stigmatise and are unfair."]}]}],
  sum:[["Pencegahan adalah kerja sama seluruh warga sekolah.","Prevention is teamwork by the whole school."],["Kegiatan positif dan pesan yang merangkul membangun sekolah aman.","Positive activities and inclusive messages build a safe school."],["Empati lebih kuat daripada stigma.","Empathy is stronger than stigma."]]}
];
