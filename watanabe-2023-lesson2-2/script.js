// ------------------------------------------------------------------------
// 共通の実験パーツ
// ------------------------------------------------------------------------

// 実験固有で設定するのはこの2個所
const expname = "watanabe-2023-lesson2-2";  // 【要設定変更1/2】 
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

// ------------------------------------------------------------------------
// 固有の実験パーツ
// ------------------------------------------------------------------------
// 実験本体
function startExperiment() {

const save_data = {
    type: jsPsychPipe,
    action: "save",
    experiment_id: osf_experiment_id, // DataPipeで表示されるID
    filename: filename,
    data_string: ()=>jsPsych.data.get().csv()
};

var enter_fullscreen = {
  type: jsPsychFullscreen,
  message: '<p>実験名: 2022-2-2 </p><p>開始ボタンを押すと全画面表示で実験が始まります。</p>',
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

var blankscreen = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: "NO_KEYS",
  trial_duration: 1500,
};


// 実験の終了
var bye = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: 'これで実験は終了です。 PCには触れずに実験者の指示に従ってください。',
};

// ------------------------------------------------------------------------
// 練習用問題の作成
// ------------------------------------------------------------------------
// 説明
var pre_hello = {
  type: jsPsychHtmlKeyboardResponse,
    stimulus: '実験の練習を始めます。 何秒間音声が流れていたか選択してください。<br><br>スペースキーを押すと始まります。',
    choices: ' ',
};


var pre_bye = {
  type: jsPsychHtmlKeyboardResponse,
    stimulus: '実験の練習が終わりました。 <br><br>スペースキーを押すと次に進みます。',
    choices: ' ',
};

const pre_answertext = [
  "1.5秒", "7秒", "10秒",
];

var pre_likert = {
  type: jsPsychSurveyLikert,
  scale_width: 800,
  button_label: "決定して次へ" ,
  questions: [
    {
      prompt: '<p style="font-size: 32px;">何秒間音声が流れていたか選択してください。</p>',
      labels: [
        "1.5<br>秒",
        "7<br>秒",
        "10<br>秒",
      ]
    }
  ],
  on_finish: function (data) {
     data.label  = pre_answertext[data.response.Q0] ;
  },
};

var baseURL = './voice/' ;
var pre_examVoice = [
  { label: '20-1sec', filename: '1000msec.mp3' },
  { label: '40-6sec', filename: '6000msec.mp3' },
  { label: '50-9sec', filename: '9000msec.mp3' },
];

// 順番をランダマイズしたいので指定しておく
var pre_trials = {
  timeline: [],
  timeline_variables: pre_examVoice,
  randomize_order: true,
};

// 画像問題の本体
var pre_exam = {
    type: jsPsychAudioKeyboardResponse,
    stimulus: function () {return  baseURL + jsPsych.timelineVariable('filename') ; },
//    prompt: function () {return jsPsych.timelineVariable('label'); },
//    trial_duration: 20000,
    trial_ends_after_audio: true,
    choices: "NO_KEYS",
    data: {
      label: jsPsych.timelineVariable('label'),
    },
};

pre_trials.timeline.push(eyepoint) ;
pre_trials.timeline.push(pre_exam) ;
pre_trials.timeline.push(blankscreen) ;
pre_trials.timeline.push(pre_likert) ;
pre_trials.timeline.push(blankscreen) ;

// ------------------------------------------------------------------------
// 本番用問題の作成
// ------------------------------------------------------------------------

// 実験の説明
var hello = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '実験を始めます。 1500 msec の凝視点の後に音声が流れます。　その後、音声が流れていた時間を答えてください。<br><br>スペースキーを押すと始まります。',
  choices: ' ',
};

const answertext = [
  "0秒", "0.5秒", "1秒", "2秒", "3秒",
  "4秒", "5秒", "6秒", "7秒", "8秒",
  "9秒", "10秒", "11秒", "12秒", "13秒",
  "14秒", "15秒", "16秒", "17秒", "18秒",
  "19秒", "20秒",
];

var likert = {
  type: jsPsychSurveyLikert,
  scale_width: 800,
  button_label: "決定して次へ" ,
  questions: [
    {
      prompt: '<p style="font-size: 32px;">何秒間音声が流れていたか選択してください。</p>',
      labels: [
        "0<br>秒",
        "0.5<br>秒",
        "1<br>秒",
        "2<br>秒",
        "3<br>秒",
        "4<br>秒",
        "5<br>秒",
        "6<br>秒",
        "7<br>秒",
        "8<br>秒",
        "9<br>秒",
        "10<br>秒",
        "11<br>秒",
        "12<br>秒",
        "13<br>秒",
        "14<br>秒",
        "15<br>秒",
        "16<br>秒",
        "17<br>秒",
        "18<br>秒",
        "19<br>秒",
        "20<br>秒",
      ]
    }
  ],
  on_finish: function (data) {
     data.label  = answertext[data.response.Q0] ;
  },
};

// ------------------------------------------------------------------------
// 音声ファイルの用意

var baseURL = './voice/' ;
var examVoice = [
  { label: '10-0.5sec', filename: '500msec.mp3' },
  { label: '11-0.5sec', filename: '500msec.mp3' },
  { label: '12-0.5sec', filename: '500msec.mp3' },
  { label: '13-0.5sec', filename: '500msec.mp3' },
  { label: '14-0.5sec', filename: '500msec.mp3' },

  { label: '20-1sec', filename: '1000msec.mp3' },
  { label: '21-1sec', filename: '1000msec.mp3' },
  { label: '22-1sec', filename: '1000msec.mp3' },
  { label: '23-1sec', filename: '1000msec.mp3' },
  { label: '24-1sec', filename: '1000msec.mp3' },

  { label: '30-3sec', filename: '3000msec.mp3' },
  { label: '31-3sec', filename: '3000msec.mp3' },
  { label: '32-3sec', filename: '3000msec.mp3' },
  { label: '33-3sec', filename: '3000msec.mp3' },
  { label: '34-3sec', filename: '3000msec.mp3' },

  { label: '40-6sec', filename: '6000msec.mp3' },
  { label: '41-6sec', filename: '6000msec.mp3' },
  { label: '42-6sec', filename: '6000msec.mp3' },
  { label: '43-6sec', filename: '6000msec.mp3' },
  { label: '44-6sec', filename: '6000msec.mp3' },

  { label: '50-9sec', filename: '9000msec.mp3' },
  { label: '51-9sec', filename: '9000msec.mp3' },
  { label: '52-9sec', filename: '9000msec.mp3' },
  { label: '53-9sec', filename: '9000msec.mp3' },
  { label: '54-9sec', filename: '9000msec.mp3' },

  { label: '60-12sec', filename: '12000msec.mp3' },
  { label: '61-12sec', filename: '12000msec.mp3' },
  { label: '62-12sec', filename: '12000msec.mp3' },
  { label: '63-12sec', filename: '12000msec.mp3' },
  { label: '64-12sec', filename: '12000msec.mp3' },

];

// examVoice.splice(3) ; // テスト用に配列サイズを詰める test

// 順番をランダマイズしたいので指定しておく
var trials = {
  timeline: [],
  timeline_variables: examVoice,
  randomize_order: true,
};

// 画像問題の本体
var exam = {
    type: jsPsychAudioKeyboardResponse,
    stimulus: function () {return  baseURL + jsPsych.timelineVariable('filename') ; },
//    prompt: function () {return jsPsych.timelineVariable('label'); },
//    trial_duration: 20000,
    trial_ends_after_audio: true,
    choices: "NO_KEYS",
    data: {
      label: jsPsych.timelineVariable('label'),
    },
};

trials.timeline.push(eyepoint) ;
trials.timeline.push(exam) ;
trials.timeline.push(blankscreen) ;
trials.timeline.push(likert) ;
trials.timeline.push(blankscreen) ;

// ------------------------------------------------------------------------
// 実験の開始
// ------------------------------------------------------------------------

jsPsych.run([preload,enter_fullscreen,par_id,pre_hello,pre_trials,pre_bye,hello,trials,bye, save_data,exit_fullscreen]);

// 実験本体の終了
}
