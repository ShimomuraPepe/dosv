/*

	Initialize Script
	
	ゲームのスコア、判定などの変数をまとめる。

*/

var singleMode = false;

var StageNum = 0;			// ステージ数
var ExtraStage = 0;

// 画面サイズ関係
var atsize = 0;				// 画面サイズを自動にする場合は1、手動の場合は0
var mtsize = [1280,720];	// 画面サイズ設定
var arsize = 100;			// 矢印縦横幅
var onwide = 160;			// おにぎり横幅
var defsize = 125;			// 矢印画像元サイズ
var corarr = -5;			// 矢印位置微調整
var cvsize = [0,0];			// 画面サイズ（起動時に設定するためここでの指定は不要）

// スコア関係
var psc = 0;			// プレイスコア変数
var msc = 1000000;		// 最大スコア変数
var ssc = [0,0,0,0];	// 各ステージ毎のスコア記録配列

// コンボ関係
var ncb = 0;			// 現状コンボ変数
var mcb = 0;			// 最大コンボ変数
var scb = [0,0,0,0];	// 各ステージ毎の最大コンボ記録配列

// ランク関係
var brk = [0.975,0.95,0.925,0.9,0.8,0.7,0.6,0.5,0.4,0.3]	// ランク選定基準[PF,SS,S,AAA,AA,A,B,C,D,E,F]
var lrk = ["SSS","SS","S","AAA","AA","A","B","C","D","E","F"];	// ランク文字表記
var crk = ["#FFFF00","#FFFF00","#FFFF00","#FF0000","#FF00FF","#00FF00","#00FFFF","#00FFFF","#00FFFF","#00FFFF","#00FFFF"];
// ランク文字色
var srk = [0,0,0,0];	// 各ステージ毎のランク記録配列

// 判定関係
var bjd = [2,4,6,8];	// 判定フレーム [PF,GREAT,GOOD,NEAR,MISS,AUTO]
var jdn = [0,0,0,0,0,0];	// 判定結果格納配列
var jda = [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
// 各ステージ毎の判定結果格納配列

// ゲージ関係
var ngg = 0;			// 現在ゲージ数
var mgg = 0;			// 最大ゲージ数（可変）
var gmd = 0;			// ゲージ増減モード 0:Normal,1:Easy,2:Hard,3:Survival,4:Extreme,5:1/4
var pug = [6,9,3,6,3,1];					// 回復ゲージ量（PERFECT）
var gug = [2,5,0,2,1,0];					// 回復ゲージ量（GREAT）
var ndg = [0.02,0.01,0.03,0.06,0.15,0.25];	// 減少ゲージ量（NEAR)
var mdg = [0.05,0.04,0.08,0.15,0.15,0.25];	// 減少ゲージ量（MISS）
var sgg = [0.2,0.5,0.0,1,1,1];				// 初期ゲージ量
var cgg = [0.8,0.7,0.84,0,0,0];				// 規定ゲージ量（0はゲージ切れ時点で終了）
var gst = ["Nm","Es","Hd","Bs","An","4D"];	// ゲージモード表記（ダンおにッター用）

// ゲージ変動関数
var gch = function(num){
	jdn[num]++;
	if(num == 0){	// PERFECT
		ngg+=pug[gmd];
	}else if(num == 1){	// GREAT
		ngg+=gug[gmd];
	}else if(num == 3){	// NEAR
		ngg-=mgg*ndg[gmd];
	}else if(num == 4){	// MISS
		ngg-=mgg*mdg[gmd];
	}
	ncb = (num < 3 || num == 5) ? ncb + 1 : 0; // GOOD以上はコンボ継続、以下はリセット
	if(mcb < ncb){	// 最大コンボ更新
		mcb = ncb;
	}
	if(ngg>mgg)ngg=mgg;	// ケージが最大値を超えれば最大値に合わせる。
	if(ngg<0){	// ケージが0を下回る場合。
		if(cgg[gmd] == 0){ // Lifeゲージの場合、ゲームオーバー処理を実施
			gameOver = true;
		}else{ // Grooveゲージの場合は0に合わせる。
			ngg = 0;
		}
	}
};

// オプション関係
var hsp = 1;			// ハイスピード
var hom = 5;			// 設定可能上限
var rvs = 0;			// リバース
var cor = 0;			// フレーム調整
var rdm = 0;			// 矢印配置設定
// 0:Normal 1:Mirror 2:A-Mirror 3:Random 4:A-Random 5:S-Random 6:AS-Random

// ノーツ関係
var dfn = 0;						// 譜面番号
var MusicNum=0;						// 楽曲番号（初期読み込み用。以降は楽曲数最大値計算）
var SelectNum = 0;					// 楽曲番号（プレイ用）
var MusicName=new Array();			// 楽曲名
var MusicArtist=new Array();		// アーティスト名
var ViewMusic=new Array();			// 譜面別楽曲名
var ArtistLink=new Array();			// アーティストサイトリンク
var MusicFile=new Array();			// 楽曲ファイル
var DiffName=new Array();			// 難易度表記
var StartBPM=new Array();			// 開始BPM
var KeyNum=new Array();				// 譜面キー数（5 or 7）
var frameAdjust = new Array();		// フレーム調整
var NotesCreator=new Array();		// 譜面作成者
var SelectMusic=new Array();		// 譜面別使用楽曲ファイル
var LongMode = new Array();			// 凍結矢印モード（true : 終端判定あり、false : 終端判定なし）
var ArrowSets = new Array();		// 譜面情報
var Comments = new Array();			// コメント
var ExtraMusic = new Array();		// 隠し曲（利用する場合はdos.jsを改造する必要あり）
var defcolor = new Array();
/*
	初期矢印色設定
	１次元[偶数レーン,奇数レーン]（5keyの場合はすべて偶数レーン側を選択）
	２次元[通常矢印、凍結矢印、凍結矢印内部、凍結矢印内部（押下中）、凍結矢印帯、凍結矢印帯（押下中）]
*/

// ゲーム処理関係
var noteNum;	// 矢印数
var longCnt;	// 凍結矢印数
var chkaw = [[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
//　矢印別フレーム番号格納配列
var chklg = [[],[],[],[],[],[],[]];
//　凍結矢印別フレーム番号格納配列
var nowaw = [0,0,0,0,0,0,0];	// 矢印配置処理用配列／矢印判定管理用配列
var notmx = [0,0,0,0,0,0,0];	// レーン別矢印数計算
var btnpl = [false,false,false,false,false,false,false];	// キー押下判定
var chhsp = new Array();		// ハイスピード変更タイミング格納配列
var spdcng = 0;					// ハイスピード変更回数
var chbpm = new Array();		// BPM変更タイミング格納配列
var bpmcnt = 0;					// BPM変更回数
var MusicFrame = 0;			// 現行フレーム数
var PrevFrame = 0;			// 前フレーム（楽曲同期用）
var ArrowMove = 0;			// 移動座標数
var MoveAdd = 0;			// 移動加算値
var MoveSpeed = 1;			// 移動倍率値
var setaw = [0,0,0,0,0,0,0];	// プレイ中矢印配置および終了後矢印削除用処理番号管理配列
var setlg = [0,0,0,0,0,0,0];	// プレイ中凍結帯設置および終了後凍結帯削除用処理番号管理配列
var StartWait = 0;				// スタートウェイト
var autoplay = false;			// オートプレイ

var colors=[];	// 矢印色設定配列

//矢印角度調整関数
var KeyRole = function(lnum){
	switch(lnum){
		case 0:
			return 270;
		case 1:
			if(KeyNum[SelectNum][dfn] == 5){
				return 180;
			}else{
				return 225;
			}
		case 2:
			if(KeyNum[SelectNum][dfn] == 5){
				return 0;
			}else{
				return 180;
			}
		case 3:
			if(KeyNum[SelectNum][dfn] == 5){
				return 90;
			}else{
				return 0;
			}
		case 4:
			return 0;
		case 5:
			return 45;
		case 6:
			return 90;
	}
};

// Y座標調整関数
var setYpoint = function(knum){
	if(KeyNum[SelectNum][dfn] == 5){
		return (mtsize[0]*0.5) - ((arsize*1.1*4+onwide)/2) +((arsize*1.1)*knum);
	}else{
		if(knum == 3){
			return mtsize[0]*0.5 - (onwide/2) - ((defsize-arsize)/2)*1.6;
		}else if(knum < 3){
			return mtsize[0]*0.5 - (onwide/2) - (arsize*1.1*(3-knum)) - ((defsize-arsize)/2);
		}else{
			return mtsize[0]*0.5 + (onwide/2) + (arsize*1.1*(knum-4)) + (arsize*0.1) - ((defsize-arsize)/2);
		}
	}
};

// 判定文字列
var jdgst = ["(ﾟ∀ﾟ)ｷﾀ-!!","(・∀・)ｲｲ!!","( ´∀｀)ﾏﾀｰﾘ","( ´_ゝ｀)ﾌｰﾝ","ヽ(｀Д´#)ﾉｳﾜｧｧﾝ","( 0 v 0 ) Auto"];
// 判定文字列（リザルト用）
var jdgst2 = ["(ﾟ∀ﾟ)","(・∀・)","( ´∀｀)","(　´_ゝ｀)","ヽ(｀Д´#)ﾉ","( 0 v 0 )"];
//var jdgst = ["Perfect","Great","Good","Near","Miss"];
var jdgcl = ["#FFFF00","#00FF00","#00FFFF","#FF00FF","#FF0000","#666666"];

var gameOver = false;	// ゲームオーバーフラグ
var gameps = false;		// 途中終了フラグ
var gpRetry = false;	// リトライ処理発生フラグ

// キーコンフィグ（矢印関連）
var keycodes = [[37,40,38,39,' '.charCodeAt(0)],['S'.charCodeAt(0),'D'.charCodeAt(0),'F'.charCodeAt(0),' '.charCodeAt(0),'J'.charCodeAt(0),'K'.charCodeAt(0),'L'.charCodeAt(0)]];
// キーコンフィグ（ハイスピード変更、途中終了キー）
var keyopt = ['1'.charCodeAt(0),'2'.charCodeAt(0),8];