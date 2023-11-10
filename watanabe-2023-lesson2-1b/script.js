// ------------------------------------------------------------------------
// 共通の実験パーツ
// ------------------------------------------------------------------------

// 実験固有で設定するのはこの2個所
const expname = "watanabe-2023-lesson2-1";  // 【要設定変更1/2】 
const osf_experiment_id = "RIFUr6lCBTOf";   // 【要設定変更2/2】 DataPipeで表示されるID

var filename ; // OSFのファイル名
var inputVal ; // 入力ボックスの要素を取得

var jsPsych = initJsPsych({
  on_finish: function() {
//    jsPsych.data.get().localSave('csv', 'data.csv');
//    jsPsych.data.displayData();
  }
});

// var jsPsych = initJsPsych();

var preload = {
  type: jsPsychPreload,
  auto_preload: true
}

// 保存用のファイル名を生成
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
}

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

const save_data = {
    type: jsPsychPipe,
    action: "save",
    experiment_id: osf_experiment_id, // DataPipeで表示されるID
    filename: filename,
    data_string: ()=>jsPsych.data.get().csv()
};

var enter_fullscreen = {
  type: jsPsychFullscreen,
  message: '<p>実験名: 2022-2-1B </p><p>開始ボタンを押すと全画面表示で実験が始まります。</p> <font size=1 color=silver>sound ©OtoLogic</font><br>',
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

// 凝視点
var eyepoint = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size: 48px;">+</p>',
  choices: "NO_KEYS",
  trial_duration: 1500,
};

// キー入力を待つ凝視点
var eyepointKeyboardResponse = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size: 48px;">+</p>',
  choices: " ",
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
  stimulus: 'これで実験は終了です。 PCには触れずに実験者の指示に従ってください。',
};

// 時報的な音を出して凝視点
var eyepointVoice = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: 'voice/Countdown02-2.mp3',
  prompt: '<p style="font-size: 48px;">+</p>',
  choices: "NO_KEYS",
  trial_duration: 4000,
};

// キー入力待ち
var waitKeypress = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "",
  choices: ' ',
};


// ------------------------------------------------------------------------
// 練習用問題の作成
// ------------------------------------------------------------------------

// 説明
var pre_hello = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '実験の練習を始めます。 <br><br> カウントしていただく秒数が文字で表示された後に「＋」の凝視点が表示されるので、秒数をカウントしてください。<br>カウントが終了したらスペースキーを押してください。　「＋」が消えて次の問題に進みます。<br><br>スペースキーを押すと始まります。',
  choices: ' ',
};

var pre_bye = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '実験の練習が終わりました。 <br><br>スペースキーを押すと次に進みます。',
  choices: ' ',
};

var pre_examSec = [
  { label: '1.5秒' },
  { label: '7秒'},
  { label: '10秒'},
];

// 順番をランダマイズしたいので指定しておく
var pre_trials = {
  timeline: [],
  timeline_variables: pre_examSec,
  randomize_order: true,
};

// 問題の本体
var pre_exam = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {return  "<font size=48px>" + jsPsych.timelineVariable('label') + "</font>"; },
    choices: 'NO_KEYS',
    trial_duration: 2500,
};

// pre_trials.timeline.push(eyepointVoice) ; // 凝視点の直前に時報的な音を入れる
pre_trials.timeline.push(blankscreen) ;
pre_trials.timeline.push(pre_exam) ;
pre_trials.timeline.push(eyepointKeyboardResponse) ; 

// ------------------------------------------------------------------------
// 本番用問題の作成
// ------------------------------------------------------------------------

// 説明
var hello = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '実験を始めます。<br><br> カウントしていただく秒数が文字で表示された後に「＋」の凝視点が表示されるので、秒数をカウントしてください。<br>カウントが終了したらスペースキーを押してください。　「＋」が消えて次の問題に進みます。<br><br>スペースキーを押すと始まります。',
  choices: ' ',
};

var examSec = [
  { label: '0.5秒' },
  { label: '0.5秒' },
  { label: '0.5秒' },
  { label: '0.5秒' },
  { label: '0.5秒' },

  { label: '5秒' },
  { label: '5秒' },
  { label: '5秒' },
  { label: '5秒' },
  { label: '5秒' },

  { label: '1秒' },
  { label: '1秒' },
  { label: '1秒' },
  { label: '1秒' },
  { label: '1秒' },

  { label: '3秒' },
  { label: '3秒' },
  { label: '3秒' },
  { label: '3秒' },
  { label: '3秒' },

  { label: '6秒' },
  { label: '6秒' },
  { label: '6秒' },
  { label: '6秒' },
  { label: '6秒' },

  { label: '9秒'},
  { label: '9秒'},
  { label: '9秒'},
  { label: '9秒'},
  { label: '9秒'},

  { label: '12秒'},
  { label: '12秒'},
  { label: '12秒'},
  { label: '12秒'},
  { label: '12秒'},
];

// examSec.splice(3) ; // テスト用に配列サイズを詰める test

// 順番をランダマイズしたいので指定しておく
var trials = {
  timeline: [],
  timeline_variables: examSec,
  randomize_order: true,
};

// 問題の本体
var exam = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {return  "<font size=48px>" + jsPsych.timelineVariable('label') + "</font>"; },
    choices: 'NO_KEYS',
    trial_duration: 2500,
};

// trials.timeline.push(eyepointVoice) ; // 時報的な音を出す 
trials.timeline.push(blankscreen) ;
trials.timeline.push(exam) ;
trials.timeline.push(eyepointKeyboardResponse) ;

// ------------------------------------------------------------------------
// 実験の開始
// ------------------------------------------------------------------------

jsPsych.run([enter_fullscreen,par_id,pre_hello,pre_trials,pre_bye,hello,trials,bye,save_data,exit_fullscreen]);

// 実験本体の終了
}
