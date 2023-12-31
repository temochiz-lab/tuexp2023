// ------------------------------------------------------------------------
// 共通の実験パーツ
// ------------------------------------------------------------------------

// 実験固有で設定するのはこの2個所
const expname = "watanabe-2023-lesson1-1";  // 【要設定変更1/2】 
const osf_experiment_id = "RIFUr6lCBTOf";   // 【要設定変更2/2】 DataPipeで表示されるID

var filename ; // OSFのファイル名
var inputVal ; // 入力ボックスの要素を取得

// jsPsych 初期化
var jsPsych = initJsPsych({
  on_finish: function() {
//    jsPsych.data.get().localSave('csv', 'data.csv'); // ローカルで保存する時に使用
//    jsPsych.data.displayData();                      // 結果を表示する時に使用
  }
});

// クラウド(DataPipe)保存用のファイル名を生成
function createfilename(argseed) {
  // 日付時間秒を文字列で返す	
  const dt = new Date();
  var yyyy = dt.getFullYear();
  var mm = ('00' + (dt.getMonth()+1)).slice(-2);
  var dd = ('00' + dt.getDate()).slice(-2);
  var hh = ('00' + dt.getHours()).slice(-2);
  var mi = ('00' + dt.getMinutes()).slice(-2);
  var se = ('00' + dt.getSeconds()).slice(-2);
  var answer = yyyy + mm + dd + "-" + hh + mm + se ;
  const subject_id = jsPsych.randomization.randomID(10);
  answer =  argseed + answer + "-" + subject_id +".csv" ;
  return (answer);
  } ;


// htmlからボタンを押された時の呼び出し
// 入力値をOSFのファイル名にするために一旦入力からのファイル名生成、実験本体に進む
function pushNext() {
    // myInputが空でないか確認する
    inputVal = document.getElementById("myInput").value;
    if (inputVal) {
        // ファイル名を生成する
        filename = createfilename(expname + '-ID.' + inputVal+ '-') ;
        startExperiment() ;
    }
}

// 実験本体
function startExperiment() {

// ------------------------------------------------------------------------
// 固定の実験パーツ
// ------------------------------------------------------------------------
// DataPipe保存設定
const save_data = {
    type: jsPsychPipe,
    action: "save",
    experiment_id: osf_experiment_id, // DataPipeで表示されるID
    filename: filename,
    data_string: ()=>jsPsych.data.get().csv()
};

var enter_fullscreen = {
  type: jsPsychFullscreen,
  message: '<p>実験名: 2023-1-セッション1</p><p>開始ボタンを押すと全画面表示で実験が始まります。</p>',
  button_label: "開始",
  fullscreen_mode: true
}

// 最初の説明と被検者情報の入力
var par_id = {
  type: jsPsychSurveyText,
  questions: [
    {prompt: 'あなたの性別を男性であれば 1、女性であれば 2、答えたくない場合は 3 を入力してください。', columns: 10, required: true, name: 'sex'},
    {prompt: 'あなたの年齢を入力してください。', columns: 10, required: true, name: 'age'},
  ],
  button_label: '次へ',
};

var exit_fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
  delay_after: 0
}

var preload = {
  type: jsPsychPreload,
  auto_preload: true
}

// 実験の説明
var hello = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '実験のセッション1を始めます。<br> \
1500 msec の凝視点の後に表示される言葉を音読してください。<br>\
2500msec 表示後に、2000 msec 待った後に次の刺激に切り替わります。<br><br>\
何かキーを押すと始まります。',
};

// 凝視点
var eyepoint = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size: 48px;">+</p>',
  choices: "NO_KEYS",
  trial_duration: 1500,
};

var blankscreen = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: "NO_KEYS",
  trial_duration: 2000,
};


// 実験の終了
var bye = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: 'これでセッション1は終了です。 PCには触れずに実験者の指示に従ってください。',
};

// ------------------------------------------------------------------------
// 画像問題の作成
// ------------------------------------------------------------------------

// 刺激
var examSession1 = [
  { label: 'あおいろしんこく'   , group:'j' },
  { label: 'かんりくみあい'     , group:'j' },
  { label: 'けんげんきょうか'   , group:'j' },
  { label: 'こじんしょとく'     , group:'j' },
  { label: 'しゃかいほしょう'   , group:'j' },
  { label: 'せいめいほけん'     , group:'j' },
  { label: 'たんしんふにん'     , group:'j' },
  { label: 'にっしんせんそう'   , group:'j' },
  { label: 'ふくごうそざい'     , group:'j' },
  { label: 'めいじけんぽう'     , group:'j' },
  { label: '印鑑証明'           , group:'j' },
  { label: '規制緩和'           , group:'j' },
  { label: '健康食品'           , group:'j' },
  { label: '古典学派'           , group:'j' },
  { label: '少数激戦'           , group:'j' },
  { label: '太陽電池'           , group:'j' },
  { label: '内需拡大'           , group:'j' },
  { label: '表示価格'           , group:'j' },
  { label: '補正予算'           , group:'j' },
  { label: '落語協会'           , group:'j' },
];

// examSession1.splice(3) ; // テスト用に配列サイズを詰める test

// 順番をランダマイズしたいので指定しておく
var trials = {
  timeline: [],
  timeline_variables: examSession1,
  randomize_order: true,
};

// 画像問題の本体
var exam = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {return  "<p style='font-size: 48px;'>" + jsPsych.timelineVariable('label') + "</p>"; },
    trial_duration: 2500,
    choices: "NO_KEYS",
};

trials.timeline.push(eyepoint) ;
trials.timeline.push(exam) ;
trials.timeline.push(blankscreen) ;

// ------------------------------------------------------------------------
// 実験の開始
// ------------------------------------------------------------------------

jsPsych.run([enter_fullscreen,par_id,hello,trials, bye, save_data, exit_fullscreen]);

// 実験本体の終了
}
