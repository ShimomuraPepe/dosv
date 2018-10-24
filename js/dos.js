/*

	Dancing Onigiri System Type-V （DoS-TV）
	Powered by enchantjs
	
	Source Creator by 霜村ぺぺ
	
	本ソースは自由に利用、改変することが可能です。
	ただし、法律や条例などに違反に該当する利用または改変や
	楽曲やその他著作権侵害が発生する利用は禁止しております。
	本ソース利用の際は、楽曲制作者に許可をいただいた楽曲
	公式サイト等で使用許可をアナウンスしている楽曲
	もしくは自作の楽曲を利用してご利用ください。
	

*/
// バージョン表記
// 改変する場合はfrom以降を任意の文字列に変更してください。
const versions = "0.9.10β from PePe-Channel.JP";

// ユーザエージェント取得
const userAgent = window.navigator.userAgent.toLowerCase();

var singleOrder = window.location.search.substring(1);
var exclear;

if(singleOrder.length>0 && singleOrder>=0 && singleOrder < MusicNum+1){
	singleMode = true;
	SelectNum = Math.floor(singleOrder);
}
// URLの最後に&Xを入力するとオートプレイ有効
if(singleOrder.length>0&&singleOrder=="X"){
	autoplay=true;
}
console.info(exclear);
//enchantjs利用宣言
enchant();

window.onload=function(){

	//画面サイズ指定
	//atsize変数が1である場合、画面の向きに合わせて
	//縦横を自動的にあわせます。
	//atsize変数が0である場合はmtsize[width,height]で指定された
	//サイズに変更します。。
	if(atsize==1){
		if(window.orientation == -90 || window.orientation == 90){
			//画面縦向き
			var cvsize = [window.innerHeight,window.innerWidth];
		}else{
			//画面横向き
			var cvsize = [window.innerWidth,window.innerHeight];
		}
	}else{
		cvsize = [mtsize[0],mtsize[1]];
	}
	
	//ゲーム用変数を宣言します。
	//このとき、画面サイズを決定します。
	var game = new Game(cvsize[0],cvsize[1]);
	//アセット読み込み
	game.preload('twiticon.png','7keyon.png','7keyoff.png','onikeyon.png','onikeyoff.png','se/pushbutton.mp3','se/nc132595.wav');
	//フレームレート設定
	game.fps = 60;
	
	game.onload = function(){	//ここからゲームを構築していきます。
	
	//矢印流量設定
	//1フレームあたりの流量を設定します。
	var frameMove = cvsize[1] /120;
	
	//譜面難易度自動測定器（試作機）
	var diffLevel = function(){
		var timelength = 0
		var timenumber = 0
		var singleflag = [false,false,false,false,false,false,false];
		var totalflag = [false,false,false,false,false,false,false];
		var onepress = false;
		var longflags = [false,false,false,false,false,false,false];
		var longpress = false;
		var samecount = 0;
		var sametemp = 0;
		var eqcount = 0;
		var eqadded = [0,0,0,0,0,0,0];
		var notecount = 0;
		var longlevel = 0;
		var longcount = 0;
		var onetimes = 0;
		var maxtimes = 0;
		var avetimes = 0;
		var nowframe = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		var prevnums = [0,0,0,0,0,0,0];
		var timetemps = 0;
		for(var m = 0;m<KeyNum[SelectNum][dfn]*2;m++){
			timetemps = Math.max.apply(null,ArrowSets[SelectNum][dfn][m]);
			if(timelength < timetemps){
				timelength = timetemps;
			}
		}
		timenumber = timelength/60;
		
		for(var i = 0;i <timelength;i++){
			if(onepress){
				totalflag = singleflag.slice();
			}
			singleflag = [false,false,false,false,false,false,false];
			if(onetimes > 0){
				onetimes-=((KeyNum[SelectNum][dfn]-longcount)/KeyNum[SelectNum][dfn]);
				if(onetimes<0){
					onetimes=0;
				}
			}else{
				onetimes = 0;
			}
			var j=0;
			onepress = false;
			for(;j < KeyNum[SelectNum][dfn];j++){
				if(ArrowSets[SelectNum][dfn][j][nowframe[j]] == i){
					onepress = true;
					notecount++;
					sametemp++;
					singleflag [j]=true;
					if(totalflag[j]){
						var tmpeq = eqadded[j];
						if(tmpeq>0){
							if(longcount>0){
								tmpeq*=2;
							}
							eqcount+=tmpeq;
						}
						eqadded[j]=100;
					}
					if(longcount>0){
						longlevel+=longcount*5;
					}
					onetimes+=game.fps;
					if(onetimes>maxtimes){
						maxtimes = onetimes;
					}
					prevnums[j] = i;
					nowframe[j]++;
				}
			}
			for(;j<KeyNum[SelectNum][dfn]*2;j++){
				if(ArrowSets[SelectNum][dfn][j][nowframe[j]] == i){
					notecount++;
					sametemp++;
					if(!longflags[j-KeyNum[SelectNum][dfn]]){
						if(totalflag[j-KeyNum[SelectNum][dfn]]){
							var tmpeq = eqadded[j-KeyNum[SelectNum][dfn]];
							if(tmpeq>0){
								eqcount+=tmpeq;
							}
							eqadded[j-KeyNum[SelectNum][dfn]]=100;
						}
						if(longcount>0){
							longlevel+=longcount*5;
						}
						onepress = true;
						singleflag[j-KeyNum[SelectNum][dfn]]=true;
						longflags[j-KeyNum[SelectNum][dfn]]=true;
						longcount++;
					}else{
						longflags[j-KeyNum[SelectNum][dfn]]=false;
						longcount--;
					}
					onetimes+=game.fps;
					if(onetimes>maxtimes){
						maxtimes = onetimes;
					}
					prevnums[j-KeyNum[SelectNum][dfn]] = i;
					nowframe[j]++;
				}
			}
			if(longcount>0){
				longlevel+=longcount/5;
			}
			if(sametemp>1){
				samecount+=sametemp-1;
			}
			for(var k=0;k<KeyNum[SelectNum][dfn];k++){
				if(eqadded[k]>0){
					eqadded[k]--;
				}
			}
			avetimes+=onetimes;
			sametemp=0;
		}
		LevelNumbers = [notecount/timenumber/4,samecount/timenumber/2,longlevel/timenumber/11,eqcount/timenumber/45,(maxtimes+(avetimes/timenumber))/865000];
		
	};
	//難易度数値格納配列
	//[矢印平均密度,同時押し,凍結矢印,縦連打,最大密度]
	var LevelNumbers = [0,0,0,0,0];
	
	// シーン下地
	var BaseScene = new Scene();
	BaseScene.addEventListener('enter',function(){
		// TitleSceneの手前でなにか表示させる場合は、enter処理を変更する。
		game.pushScene(TitleScene);
		TitleClick=false;
	});
	
	// スプライト部
	var LineSize = 5;
	var ArrowSurfaces=[null];
	var ArsCount = 0;
	// スプライト生成関数
	var ArsAdded = function(cols,lngs,onfl,bkcl){
		if(onfl){
			// おにぎり
			var wds = defsize*1.6;
			var hgs = defsize;
			ArrowSurfaces[ArsCount] = new Surface(defsize*1.6,defsize);
			context = ArrowSurfaces[ArsCount].context;
			context.beginPath();
			context.moveTo(wds*0.3375,hgs*0.06);
			context.lineTo(wds*0.1,hgs*0.45);
			context.lineTo(wds*0.0625,hgs*0.52);
			context.quadraticCurveTo(wds*(-0.04375),hgs*0.72,wds*0.0625,hgs*0.93);
			context.lineTo(wds*0.9375,hgs*0.93);
			context.quadraticCurveTo(wds*1.025,hgs*0.72,wds*0.9375,hgs*0.52);
			context.lineTo(wds*0.9,hgs*0.45);
			context.lineTo(wds*0.6625,hgs*0.06);
			context.closePath();
			context.fillStyle = lngs ? bkcl : "rgba(0,0,0,0.5)";
			context.fill();
			context.beginPath();
			context.moveTo(wds*0.3375,hgs*0.06);
			context.lineTo(wds*0.1,hgs*0.45);
			context.moveTo(wds*0.0625,hgs*0.52);
			context.quadraticCurveTo(wds*(-0.04375),hgs*0.72,wds*0.0625,hgs*0.93);
			context.moveTo(wds*0.9375,hgs*0.93);
			context.quadraticCurveTo(wds*1.025,hgs*0.72,wds*0.9375,hgs*0.52);
			context.moveTo(wds*0.9,hgs*0.45);
			context.lineTo(wds*0.6625,hgs*0.06);
			context.moveTo(wds*0.25625,hgs*0.51);
			context.lineTo(wds*0.20625,hgs*0.59);
			context.moveTo(wds*0.74375,hgs*0.51);
			context.lineTo(wds*0.79375,hgs*0.59);
			context.moveTo(wds*0.41875,hgs*0.57);
			context.lineTo(wds*0.5,hgs*0.9);
			context.lineTo(wds*0.58125,hgs*0.57);
			context.moveTo(wds*0.45,hgs*0.66);
			context.lineTo(wds*0.55,hgs*0.66);
			context.lineWidth=LineSize;
			context.strokeStyle = cols;
			context.stroke();
			context.fillStyle = cols;
			context.fillRect(wds*0.4,hgs*0.06,wds*0.2,hgs*0.39);
			
		}else{
			// 矢印
			ArrowSurfaces[ArsCount] = new Surface(defsize,defsize);
			context = ArrowSurfaces[ArsCount].context;
			context.beginPath();
			context.moveTo(defsize*0.5,defsize*0.02);
			context.lineTo(defsize*0.02,defsize*0.5);
			context.lineTo(defsize*0.25,defsize*0.5);
			context.lineTo(defsize*0.25,defsize*0.98);
			context.lineTo(defsize*0.75,defsize*0.98);
			context.lineTo(defsize*0.75,defsize*0.5);
			context.lineTo(defsize*0.98,defsize*0.5);
			context.closePath();
			context.lineWidth=LineSize;
			context.strokeStyle = cols;
			context.fillStyle = lngs ? bkcl : "rgba(0,0,0,0.5)";
			context.fill();
			context.stroke();
		}
		ArsCount++;
		return ArsCount-1;
	};
	var ArsReset = function(){
		for(;ArsCount>0;ArsCount--){
			ArrowSurfaces[ArsCount] = 0;
		}
	}
	
	// 長方形ボタン（もともとおにぎりの借りスプライト）
	// 現在はリザルト画面のタイトルバックボタンとして使用
	var SpaceSurface = new Surface(onwide,arsize);
	SpaceSurface.context.beginPath();
	SpaceSurface.context.moveTo(onwide*0.02,arsize*0.02);
	SpaceSurface.context.lineTo(onwide*0.02,arsize*0.98);
	SpaceSurface.context.lineTo(onwide*0.98,arsize*0.98);
	SpaceSurface.context.lineTo(onwide*0.98,arsize*0.02);
	SpaceSurface.context.closePath();
	SpaceSurface.context.lineWidth = LineSize;
	SpaceSurface.context.strokeStyle = "#FFFFFF";
	SpaceSurface.context.fillStyle = "rgba(0,0,0,0.5)";
	SpaceSurface.context.fill();
	SpaceSurface.context.stroke();
	
	//凍結矢印連結画像
	var LongLine = new Surface(arsize,1);
	LongLine.context.beginPath();
	LongLine.context.moveTo(0,0);
	LongLine.context.lineTo(arsize,0);
	LongLine.context.lineTo(arsize,1);
	LongLine.context.lineTo(0,1);
	LongLine.context.closePath();
	LongLine.context.fillStyle = "rgba(0,100,255,0.5)";
	LongLine.context.fill();
	
	// シーン取りまとめ
	// タイトル画面
	var TitleScene = new Scene();
	// 選曲画面
	var MusicScene = new Scene();
	// 楽曲決定画面
	var DecisionScene = new Scene();
	// メインローダー
	var LoadingScene = new Scene();
	// プレイシーン
	var PlayingScene = new Scene();
	// リザルト
	var ResultScene = new Scene();
	
	// タイトルシーン
	
	// Dancing Onigiriラベル
	var ttLabel = new Label();
	ttLabel.width = cvsize[0];
	ttLabel.height = cvsize[1]/5;
	ttLabel.x = 0;
	ttLabel.y = cvsize[1]/4;
	ttLabel.text = "Dancing Onigiri";
	ttLabel.color = "#fff";
	ttLabel.font = (cvsize[0]/10)+"px 'Lobster' , sursive";
	ttLabel.textAlign = "center";
	TitleScene.addChild(ttLabel);
	
	// サブタイトルラベル（シングルモードでは曲名表示）
	var stLabel = new Label();
	stLabel.height = cvsize[1]/20;
	stLabel.color = "#fff";
	if(!singleMode){
		stLabel.y = ttLabel.y+(cvsize[0]/10);
		stLabel.text = "HTML 5 Edition";
		stLabel.font = (cvsize[0]/30)+"px 'Lobster' , sursive";
		stLabel.x = cvsize[0]*0.2;
		stLabel.width = cvsize[0]*0.5;
		stLabel.textAlign = "left";
	}else{
		stLabel.y = ttLabel.y+(cvsize[0]/8);
		stLabel.text = MusicName[SelectNum];
		stLabel.font = (cvsize[0]/30)+"px 'Rounded Mplus 1c'";
		stLabel.width = cvsize[0];
		stLabel.x = 0;
		stLabel.textAlign = "center";
	}
	TitleScene.addChild(stLabel);
	
	// メッセージラベル
	var plLabel = new Label("Click or tap to start.");
	plLabel.x = 0;
	plLabel.y = cvsize[1]*0.7;
	plLabel.width = cvsize[0];
	plLabel.font = (cvsize[0]/30)+"px 'Lobster' , sursive";
	plLabel.color = "white";
	plLabel.textAlign = "center";
	plLabel.count = 0;
	plLabel.addEventListener('enterframe',function(){
		this.count++;
		if(this.count>30){
			this.visible=!this.visible;
			this.count=0;
		}
	});
	TitleScene.addChild(plLabel);
	
	// オリジナルソース開発者表示
	var otLabel = new Label();
	otLabel.width = cvsize[0]/5;
	otLabel.height = cvsize[1]/20;
	otLabel.y = cvsize[1] - otLabel.height*2-5;
	otLabel.x = 5;
	otLabel.text = "Original : O-toro";
	otLabel.color = "white";
	otLabel.font = (cvsize[1]/25)+"px 'Rounded Mplus 1c'";
	TitleScene.addChild(otLabel);
	
	// 本ソース開発者表示
	var ppLabel = new Label();
	ppLabel.width = cvsize[0]/5;
	ppLabel.height = cvsize[1]/20;
	ppLabel.y = cvsize[1] - ppLabel.height-5;
	ppLabel.x = 5;
	ppLabel.text = "Source : 霜村ぺぺ";
	ppLabel.color = "white";
	ppLabel.font = (cvsize[1]/25)+"px 'Rounded Mplus 1c'";
	TitleScene.addChild(ppLabel);
	
	// バージョン表記
	var vrLabel = new Label();
	vrLabel.text = "Version : "+versions;
	vrLabel.color = "white";
	vrLabel.font = (cvsize[1]/50)+"px 'Rounded Mplus 1c'";
	vrLabel.x = 5;
	vrLabel.y = 5;
	TitleScene.addChild(vrLabel);
	
	//矢印描写（タイトル画面用）
	var ttSurface = new Surface(defsize,defsize);
	context = ttSurface.context;
	context.beginPath();
	context.moveTo(defsize*0.5,defsize*0.02);
	context.lineTo(defsize*0.02,defsize*0.5);
	context.lineTo(defsize*0.25,defsize*0.5);
	context.lineTo(defsize*0.25,defsize*0.98);
	context.lineTo(defsize*0.75,defsize*0.98);
	context.lineTo(defsize*0.75,defsize*0.5);
	context.lineTo(defsize*0.98,defsize*0.5);
	context.closePath();
	context.lineWidth=2;
	context.strokeStyle = "#fff";
	context.stroke();
	
	// 矢印スプライト（常時回転）
	var ttArrow = new Sprite(defsize,defsize);
	ttArrow.image = ttSurface;
	ttArrow.x = defsize;
	ttArrow.y = defsize;
	ttArrow.addEventListener('enterframe',function(){
		if(this.rotation <359){
			this.rotation++;
		}else{
			this.rotation = 0;
		}
	});
	TitleScene.addChild(ttArrow);
	
	// 画面クリック操作
	TitleScene.addEventListener('touchstart',function(){
		game.popScene();
		diffLevel();
		otSelect();
		game.pushScene(MusicScene);
	});
	
	// 選曲画面シーン
	
	// Select Musicラベル
	var slLabel = new Label();
	slLabel.width = cvsize[0]*0.3;
	slLabel.height = cvsize[1]*0.1;
	slLabel.x = cvsize[0]*0.01;
	slLabel.y = cvsize[1]*0.01;
	slLabel.text = "Select Music";
	slLabel.color = "#fff";
	slLabel.font  = (cvsize[0]/20)+"px 'Lobster' , sursive";
	slLabel.align = "left";
	MusicScene.addChild(slLabel);
	
	// Select Musicラベル下線
	var slUnder = new Sprite(cvsize[0]*0.4,2);
	slUnder.x = 0;
	slUnder.y = slLabel.y+slLabel.height;
	slUnder.backgroundColor = "rgba(255,255,255,1)";
	MusicScene.addChild(slUnder);
	
	// 曲表示背景（クリック時楽曲読み込み開始）
	var msSelector = new Sprite(cvsize[0]*0.5,cvsize[1]*0.1+1);
	msSelector.x = cvsize[0] - msSelector.width;
	msSelector.y = cvsize[1]*0.5-msSelector.height*0.5;
	var msSelectbg = new Surface(msSelector.width,msSelector.height-1);
	context = msSelectbg.context;
	context.beginPath();
	context.fillStyle = "black";
	context.strokeStyle = "white";
	context.lineWidth = 2;
	context.fillRect(0,0,msSelectbg.width,msSelectbg.height);
	context.strokeRect(0,0,msSelectbg.width,msSelectbg.height);
	msSelector.image = msSelectbg;
	MusicScene.addChild(msSelector);
	msSelector.addEventListener('touchend',function(){
		game.popScene();
		game.pushScene(DecisionScene);
		game.load("mp3/"+MusicFile[SelectNum][SelectMusic[SelectNum][dfn]],function(){
			MusicLoading = true;
		});
	});
	
	// 曲名表示ラベル（クリック時楽曲読み込み開始）
	var smName = new Label();
	smName.x = msSelector.x+10;
	smName.y = msSelector.y;
	smName.width = msSelector.width-20;
	smName.height = msSelector.height;
	smName.color = "white";
	smName.font = (smName.height*0.4)+"px 'Rounded Mplus 1c'";
	smName.text = MusicName[SelectNum];
	smName.addEventListener('enterframe',function(){
		this.text = MusicName[SelectNum];
	});
	var MusicLoading = false;
	smName.addEventListener('touchend',function(){
		game.popScene();
		game.pushScene(DecisionScene);
		// 譜面読み込み処理
		// 選曲画面にて演出をつける場合、並行して楽曲の読み込みを行う。
		game.load("mp3/"+MusicFile[SelectNum][SelectMusic[SelectNum][dfn]],function(){
			MusicLoading = true;
		});
	});
	MusicScene.addChild(smName);
	
	// アーティスト名表示背景
	var atView = new Sprite(cvsize[0]*0.25,cvsize[1]*0.05+1);
	atView.x = smName.x + smName.width/2;
	atView.y = smName.y + smName.height-1;
	var atBack = new Surface(atView.width,atView.height-1);
	context = atBack.context;
	context.beginPath();
	context.fillStyle = "black";
	context.strokeStyle = "white";
	context.lineWidth = 2;
	context.fillRect(0,0,atBack.width,atBack.height);
	context.strokeRect(0,0,atBack.width,atBack.height);
	atView.image = atBack;
	MusicScene.addChild(atView);
	
	// アーティスト名表示ラベル
	var atName = new Label();
	atName.x = atView.x + 10;
	atName.y = atView.y;
	atName.width = atView.width-20;
	atName.height = atView.height;
	atName.color = "white";
	atName.font = (atName.height*0.65)+"px 'Rounded Mplus 1c'";
	atName.text = MusicArtist[SelectNum];
	atName.addEventListener('enterframe',function(){
		this.text = MusicArtist[SelectNum];
	});
	MusicScene.addChild(atName);
	
	// 難易度切り替えボタン背景
	var dfButblk = new Surface(smName.width/3-1,atView.height-1);
	context = dfButblk.context;
	context.beginPath();
	context.lineWidth = 2;
	context.strokeStyle = "white";
	context.strokeRect(0,0,dfButblk.width,dfButblk.height);
	
	// 難易度切り替えボタンクラス
	var dfbtClass = Class.create(Sprite,{
		initialize: function(num){
			Sprite.call(this,smName.width/3,atView.height);
			this.dfnum = num;
			this.x = smName.x + (this.dfnum*this.width);
			this.y = smName.y - this.height;
			this.touchthis = function(){
				dfn = this.dfnum;
				diffLevel();
				game.assets['se/pushbutton.mp3'].currentTime=0;
				game.assets['se/pushbutton.mp3'].play();
			};
			this.image = dfButblk;
			this.backgroundColor = "#000000";
		},
		onenterframe: function(){
			if(this.dfnum == dfn){
				this.backgroundColor = "#999999";
			}else {
				this.backgroundColor = "#000000";
			}
			if(isNaN(StartBPM[SelectNum][this.dfnum])){
				this.visible = false;
			}else{
				this.visible = true;
			}
		}
	});
	
	// 難易度切り替えボタン配列
	var diffButton = new Array();
	for(var i = 0;i < 3;i++){
		diffButton[i] = new dfbtClass(i);
		diffButton[i].addEventListener('touchstart',function(){
			this.touchthis();
		});
		MusicScene.addChild(diffButton[i]);
	}
	
	// 難易度切り替えボタンラベルクラス
	var dflbClass = Class.create(Label,{
		initialize: function(num){
			Label.call(this);
			this.dfnum = num;
			this.width = smName.width/3;
			this.height = atView.height;
			this.x = smName.x + (num*smName.width/3);
			this.y = smName.y - this.height;
			this.font = (this.height*0.65)+"px 'Rounded Mplus 1c'";
			this.textAlign = "center";
			if(dfn == num){
				this.color = "black";
			}else{
				this.color = "white";
			}
			this.touchthis = function(){
				dfn = this.dfnum;
				diffLevel();
				game.assets['se/pushbutton.mp3'].currentTime=0;
				game.assets['se/pushbutton.mp3'].play();
			};
			this.chmsc = function(){
				this.text =DiffName[SelectNum][this.dfnum] + " / " +KeyNum[SelectNum][dfn];
			};
			this.chmsc();
		},
		onenterframe: function(){
			if(dfn == this.dfnum){
				this.color = "black";
			}else{
				this.color = "white";
			}
			if(isNaN(StartBPM[SelectNum][this.dfnum])){
				this.visible = false;
			}else{
				this.visible = true;
			}
		}
	});
	
	// 難易度切り替えラベル
	var diffLabel = new Array();
	for (var i = 0;i<3;i++){
		diffLabel[i] = new dflbClass(i);
		diffLabel[i].addEventListener('touchstart',function(){
			this.touchthis();
			
		});
		MusicScene.addChild(diffLabel[i]);
	}
	
	// 楽曲変更ボタン背景
	var otBack = new Surface(atView.width*1.5-1,atView.height-1);
	context = otBack.context;
	context.beginPath();
	context.strokeStyle = "white";
	context.lineWidth = 2;
	context.strokeRect(0,0,otBack.width,otBack.height);
	
	var otMusics = []; // 楽曲変更ボタン
	var otLabels = []; // 楽曲変更ラベル
	
	// 楽曲変更ボタンクラス
	var omClass = Class.create(Sprite,{
		initialize: function(nums,ypt){
			Sprite.call(this,atView.width*1.5,atView.height);
			this.x = cvsize[0]-this.width;
			this.y = ypt;
			this.lnum = nums;
			this.mnum = 0;
			this.backgroundColor = "rgba(255,255,255,0)";
			this.image = otBack;
			this.addEventListener('touchstart',function(){
				SelectNum = this.mnum;
				while(isNaN(StartBPM[SelectNum][dfn])){
					dfn--;
				}
				otSelect();
				diffLevel();
				
				game.assets['se/pushbutton.mp3'].currentTime=0;
				game.assets['se/pushbutton.mp3'].play();
				
			});
			this.addEventListener('enterframe',function(){
				if(ExtraStage==2|| singleMode){
					this.visible=false;
				}else{
					this.visible=true;
				}
			});
		}
	});
	
	// 楽曲変更ラベルクラス
	var otClass = Class.create(Label,{
		initialize: function(nums,ypt){
			Label.call(this);
			this.width = atView.width*1.5;
			this.x = cvsize[0]-this.width;
			this.y = ypt;
			this.onum = nums;
			this.color = "white";
			this.font = (atName.height*0.65)+"px 'Rounded Mplus 1c'";
			this.addEventListener('enterframe',function(){
				if(ExtraStage==2 || singleMode){
					this.visible=false;
				}else{
					this.visible=true;
				}
			});
		},
		onenterframe: function(){
			this.text = MusicName[otMusics[this.onum].mnum];
		}
	});

	// 楽曲変更ボタン対応曲番号オフセット
	var otLists = [-3,-2,-1,1,2,3];
	// 楽曲変更ボタンY座標
	var otYpoint = [diffButton[0].y - atView.height * 4.5,diffButton[0].y - atView.height * 3,diffButton[0].y - atView.height * 1.5,atView.y + atView.height + atView.height * 0.5,atView.y +atView.height + atView.height * 2,atView.y +atView.height + atView.height * 3.5];

	// 楽曲変更ボタン設置
	for (var i = 0;i<6;i++){
		otMusics[i] = new omClass(otLists[i],otYpoint[i]);
		otLabels[i] = new otClass(i,otYpoint[i]);
		MusicScene.addChild(otLabels[i]);
		MusicScene.addChild(otMusics[i]);
	}
	
	// 楽曲変更ボタンクリック時処理
	// 楽曲の位置が更新されます。
	var otSelect = function(){
		var temps;
		var nsx = 0;
		var psx = 0;
		for(var i = 2;i>=0;i--){
			while(true){
				temps = SelectNum + otMusics[i].lnum-nsx;
				if(MusicNum+1==1){
					temps = 0;
				}else if(MusicNum+1==2){
					temps = (SelectNum + Math.abs(otMusics[i].lnum)) % 2;
				}else{
					while(temps < 0){
						temps+=MusicNum+1
					}
					temps = temps % (MusicNum+1);
				}
				otMusics[i].mnum = temps;
				if(ExtraMusic[otMusics[i].mnum] <= ExtraStage || ExtraMusic[otMusics[i].mnum] <= exclear){
					break;
				}
				nsx++;
			}
		}
		for(var i = 3;i<6;i++){
			while(true){
				temps = SelectNum + otMusics[i].lnum+psx;
				if(MusicNum+1==1){
					temps = 0;
				}else if(MusicNum+1==2){
					temps = (SelectNum + Math.abs(otMusics[i].lnum)) % 2;
				}else{
					while(temps < 0){
						temps+=MusicNum+1
					}
					temps = temps % (MusicNum+1);
				}
				otMusics[i].mnum = temps;
				if(ExtraMusic[otMusics[i].mnum] <= ExtraStage || ExtraMusic[otMusics[i].mnum] <= exclear){
					break;
				}
				psx++;
			}
		}
		for(var i = 0;i<3;i++){
			diffLabel[i].chmsc();
		}
	};
	
	// オプション領域区切り線
	var UnderLine = new Sprite(cvsize[0],2);
	UnderLine.backgroundColor = "rgba(255,255,255,2)";
	UnderLine.x = 0;
	UnderLine.y = cvsize[1]*0.875;
	MusicScene.addChild(UnderLine);

	// コメント表示ラベル
	var commLabel = new Label();
	commLabel.x = cvsize[0]*0.05;
	commLabel.y = cvsize[1]*0.125;
	commLabel.height = cvsize[1]*0.6;
	commLabel.width = cvsize[0] * 0.4;
	commLabel.font = "20px 'Rounded Mplus 1c'";
	commLabel.color = "white";
	commLabel.addEventListener("enterframe",function(){
		this.text = Comments[SelectNum];
	});
	MusicScene.addChild(commLabel);

	// Play Option表示ラベル
	var psLabel = new Label();
	psLabel.width = cvsize[0]*0.4;
	psLabel.height = cvsize[1]*0.1;
	psLabel.x = cvsize[0]*0.01;
	psLabel.y = UnderLine.y-psLabel.height;
	psLabel.font  = (cvsize[0]/20)+"px 'Lobster' , sursive";
	psLabel.color = "#fff";
	psLabel.align = "left";
	psLabel.text = "Play Option";
	MusicScene.addChild(psLabel);

	// オプションボタン（分割左側）
	var OptionLeft = new Surface(cvsize[0]*0.075,cvsize[1]*0.05);
	OptionLeft.context.beginPath();
	OptionLeft.context.moveTo(OptionLeft.width-2,0);
	OptionLeft.context.lineTo(0,0);
	OptionLeft.context.lineTo(0,OptionLeft.height-2);
	OptionLeft.context.lineTo(OptionLeft.width-2,OptionLeft.height-2);
	OptionLeft.context.strokeStyle="#fff";
	OptionLeft.context.lineWidth = 3;
	OptionLeft.context.stroke();
	
	// オプションボタン（分割右側）
	var OptionRight = new Surface(cvsize[0]*0.075,cvsize[1]*0.05);
	OptionRight.context.beginPath();
	OptionRight.context.moveTo(0,0);
	OptionRight.context.lineTo(OptionRight.width-2,0);
	OptionRight.context.lineTo(OptionRight.width-2,OptionRight.height-2);
	OptionRight.context.lineTo(0,OptionRight.height-2);
	OptionRight.context.strokeStyle="#fff";
	OptionRight.context.lineWidth = 3;
	OptionRight.context.stroke();

	// オプションボタン（単品）
	var OptionButton = new Surface(cvsize[0]*0.15,cvsize[1]*0.05);
	OptionButton.context.strokeStyle = "#fff";
	OptionButton.context.lineWidth = 3;
	OptionButton.context.strokeRect(0,0,OptionButton.width-2,OptionButton.height-2);

	// Hi-Speed変更ボタン（減算）
	var HispDown = new Sprite(cvsize[0]*0.075,cvsize[1]*0.05);
	HispDown.image = OptionLeft;
	HispDown.x = cvsize[0]*0.1;
	HispDown.y = cvsize[1]*0.9;
	HispDown.backgroundColor="rgba(255,255,255,0)";
	HispDown.addEventListener('touchend',function(){
		if(hsp > 0.25){
			hsp -= 0.25;
		}else{
			hsp = 5;
		}
		
		game.assets['se/pushbutton.mp3'].currentTime=0;
		game.assets['se/pushbutton.mp3'].play();
	});

	// Hi-Speed変更ボタン（加算）
	var HispUp = new Sprite(cvsize[0]*0.075,cvsize[1]*0.05);
	HispUp.image = OptionRight;
	HispUp.x = HispDown.x+HispDown.width-3;
	HispUp.y = HispDown.y;
	HispUp.backgroundColor="rgba(255,255,255,0)";
	HispUp.addEventListener('touchend',function(){
		if(hsp < hom){
			hsp+=0.25;
		}else{
			hsp = 0.25;
		}
		
		game.assets['se/pushbutton.mp3'].currentTime=0;
		game.assets['se/pushbutton.mp3'].play();
	});
	
	// Hi-Speedラベル
	var HispLabel = new Label();
	HispLabel.width = cvsize[0]*0.15;
	HispLabel.height = cvsize[1]*0.05;
	HispLabel.x = HispDown.x;
	HispLabel.y = HispDown.y;
	HispLabel.color = "#fff";
	HispLabel.font = (cvsize[1]*0.03)+"px 'Lobster' , sursive";
	HispLabel.addEventListener('enterframe',function(){
		HispLabel.text = "  Hi-Speed : x" + hsp;
	});
	MusicScene.addChild(HispLabel);
	MusicScene.addChild(HispDown);
	MusicScene.addChild(HispUp);

	// Reverse変更ボタン
	var RevsButton = new Sprite(cvsize[0]*0.15,cvsize[1]*0.05);
	RevsButton.image = OptionButton;
	RevsButton.x = HispUp.x + HispUp.width-3 + cvsize[0]*0.01;
	RevsButton.y = cvsize[1]*0.9;
	RevsButton.backgroundColor="rgba(255,255,255,0)";
	RevsButton.addEventListener('touchend',function(){
		rvs = (rvs+1)%2;
		
		game.assets['se/pushbutton.mp3'].currentTime=0;
		game.assets['se/pushbutton.mp3'].play();
	});
	
	// Reverseラベル
	var RevsLabel = new Label();
	RevsLabel.width = cvsize[0]*0.15;
	RevsLabel.height = cvsize[1]*0.05;
	RevsLabel.x = RevsButton.x;
	RevsLabel.y = RevsButton.y;
	RevsLabel.color = "#fff";
	RevsLabel.font = (cvsize[1]*0.03)+"px 'Lobster' , sursive";
	RevsLabel.addEventListener('enterframe',function(){
		if(rvs==0){
			RevsLabel.text = "  Reverse : Off";
		}else{
			RevsLabel.text = "  Reverse : On";
		}
		
	});
	MusicScene.addChild(RevsLabel);
	MusicScene.addChild(RevsButton);

	// ゲージモード変更ボタン
	var GmodButton = new Sprite(cvsize[0]*0.15,cvsize[1]*0.05);
	GmodButton.image = OptionButton;
	GmodButton.x = RevsButton.x + RevsButton.width-3 + cvsize[0]*0.01;
	GmodButton.y = cvsize[1]*0.9;
	GmodButton.backgroundColor="rgba(255,255,255,0)";
	GmodButton.addEventListener('touchend',function(){
		gmd = (gmd+1)%6;
		
		game.assets['se/pushbutton.mp3'].currentTime=0;
		game.assets['se/pushbutton.mp3'].play();
	});

	// ゲージモードラベル
	var GmodLabel = new Label();
	GmodLabel.width = cvsize[0]*0.15;
	GmodLabel.height = cvsize[1]*0.05;
	GmodLabel.x = GmodButton.x;
	GmodLabel.y = GmodButton.y;
	GmodLabel.color = "#fff";
	GmodLabel.font = (cvsize[1]*0.03) + "px 'Lobster' , sursive";
	GmodLabel.addEventListener('enterframe',function(){
		switch(gmd){
			case 0:
				this.text = "  Groove : Normal";
				break;
			case 1:
				this.text = "  Groove : Easy";
				break;
			case 2:
				this.text = "  Groove : Hard";
				break;
			case 3:
				this.text = "  Life       : Basic";
				break;
			case 4:
				this.text = "  Life       : Another";
				break;
			case 5:
				this.text = "  Life       : 1/4 DMG";
				break;
		}
		
	});
	MusicScene.addChild(GmodLabel);
	MusicScene.addChild(GmodButton);

	// Correction調整ボタン（減算）
	var CorDown = new Sprite(cvsize[0]*0.075,cvsize[1]*0.05);
	CorDown.image = OptionLeft;
	CorDown.x = GmodButton.x + GmodButton.width + cvsize[0]*0.01;
	CorDown.y = cvsize[1]*0.9;
	CorDown.backgroundColor="rgba(255,255,255,0)";
	CorDown.addEventListener('touchend',function(){
		cor--;
		if(cor == -16){
			cor = 15;
		}
		
		game.assets['se/pushbutton.mp3'].currentTime=0;
		game.assets['se/pushbutton.mp3'].play();
	});
	
	// Correction調整ボタン（加算）
	var CorUp = new Sprite(cvsize[0]*0.075,cvsize[1]*0.05);
	CorUp.image = OptionRight;
	CorUp.x = CorDown.x + CorDown.width - 3;
	CorUp.y = cvsize[1]*0.9;
	CorUp.backgroundColor="rgba(255,255,255,0)";
	CorUp.addEventListener('touchend',function(){
		cor++;
		if(cor == 16){
			cor = -15;
		}
		
		game.assets['se/pushbutton.mp3'].currentTime=0;
		game.assets['se/pushbutton.mp3'].play();
	});
	
	// Correctionラベル
	var CorLabel = new Label();
	CorLabel.x = CorDown.x;
	CorLabel.y = CorDown.y;
	CorLabel.width = cvsize[0]*0.15;
	CorLabel.height = cvsize[1]*0.05;
	CorLabel.font = (cvsize[1]*0.03) + "px 'Lobster' , sursive";
	CorLabel.color = "#fff";
	CorLabel.addEventListener('enterframe',function(){
		this.text = "  Correction : " + cor;
	});
	
	MusicScene.addChild(CorLabel);
	MusicScene.addChild(CorDown);
	MusicScene.addChild(CorUp);
	
	// 難易度グラフクラス
	var LevelGraph = Class.create(Sprite,{
		initialize: function(dnum,xpt,ypt){
			Sprite.call(this,cvsize[0]*0.1,cvsize[1]*0.03);
			this.backgroundColor = "#fff";
			this.x = xpt;
			this.y = ypt;
			this.diffnums = dnum;
		},
		onenterframe: function(){
			if(LevelNumbers[this.diffnums]>=4){
				this.width = (cvsize[0]*0.1)*3;
			}else{
				this.width = (cvsize[0]*0.1)*LevelNumbers[this.diffnums]*(3/4);
			}
		}
	});
	
	// 難易度グラフ設置
	var LevelNotes = new LevelGraph(0,cvsize[0]*0.05,cvsize[1]*0.58);	// 譜面平均密度
	var LevelSames = new LevelGraph(1,cvsize[0]*0.05,cvsize[1]*0.62);	// 同時押し
	var LevelLongs = new LevelGraph(2,cvsize[0]*0.05,cvsize[1]*0.66);	// 凍結矢印
	var Leveleqs = new LevelGraph(3,cvsize[0]*0.05,cvsize[1]*0.70);		// 縦連
	var LevelMax = new LevelGraph(4,cvsize[0]*0.05,cvsize[1]*0.74);		// 最大密度
	MusicScene.addChild(LevelNotes);
	MusicScene.addChild(LevelSames);
	MusicScene.addChild(LevelLongs);
	MusicScene.addChild(Leveleqs);
	MusicScene.addChild(LevelMax);
	
	// Level Graphラベル
	var difLabel = new Label();
	difLabel.x = cvsize[0]*0.02;
	difLabel.y = cvsize[1]*0.47;
	difLabel.font= (cvsize[1]*0.05) + "px 'Lobster' , sursive";
	difLabel.color = "#fff";
	difLabel.text = "Level Graph";
	MusicScene.addChild(difLabel);
	
	// 難易度グラフ最小値縦線
	var Levelmin = new Sprite(3,cvsize[1]*0.24);
	Levelmin.x = LevelNotes.x;
	Levelmin.y = LevelNotes.y - cvsize[1]*0.04;
	Levelmin.backgroundColor="#fff";
	MusicScene.addChild(Levelmin);
	
	// 難易度グラフ最大値縦線
	var Levelmax = new Sprite(3,cvsize[1]*0.24);
	Levelmax.x = LevelNotes.x + (cvsize[0]*0.1)*3;
	Levelmax.y = LevelNotes.y - cvsize[1]*0.04;
	Levelmax.backgroundColor="#fff";
	MusicScene.addChild(Levelmax);
	
	// 矢印ラベル
	var ntcntLabel = new Label("矢印");
	ntcntLabel.y = LevelNotes.y-5;
	ntcntLabel.x = cvsize[0]*0.015
	ntcntLabel.color = "#fff";
	ntcntLabel.font ="20px 'Rounded Mplus 1c'";
	MusicScene.addChild(ntcntLabel);
	
	// 同時ラベル
	var sameLabel = new Label("同時");
	sameLabel.y = LevelSames.y-5;
	sameLabel.x = ntcntLabel.x;
	sameLabel.color = "#fff";
	sameLabel.font = "20px 'Rounded Mplus 1c'";
	MusicScene.addChild(sameLabel);
	
	// 凍結ラベル
	var longsLabel = new Label("凍結");
	longsLabel.y = LevelLongs.y-5;
	longsLabel.x = ntcntLabel.x;
	longsLabel.color = "#fff";
	longsLabel.font = "20px 'Rounded Mplus 1c'";
	MusicScene.addChild(longsLabel);
	
	// 縦連ラベル
	var eqsLabel = new Label("縦連");
	eqsLabel.y = Leveleqs.y-5;
	eqsLabel.x = ntcntLabel.x;
	eqsLabel.color = "#fff";
	eqsLabel.font = "20px 'Rounded Mplus 1c'";
	MusicScene.addChild(eqsLabel);
	
	// 危険ラベル
	var dngLabel = new Label("危険");
	dngLabel.y = LevelMax.y-5;
	dngLabel.x = ntcntLabel.x;
	dngLabel.color = "#fff";
	dngLabel.font = "20px 'Rounded Mplus 1c'";
	MusicScene.addChild(dngLabel);
	
	// 難易度数値ラベル
	var diffNumber = new Label();
	diffNumber.width = cvsize[1]*0.1;
	diffNumber.x = msSelector.x - diffNumber.width-5;
	diffNumber.y = msSelector.y;
	diffNumber.color = "#fff";
	diffNumber.textAlign = "right";
	diffNumber.font = "40px 'Rounded Mplus 1c'";
	diffNumber.addEventListener('enterframe',function(){
		this.text = Math.round(LevelNumbers[0]*5+LevelNumbers[1]*5+LevelNumbers[2]*5+LevelNumbers[3]*7+LevelNumbers[4]*5);
	});
	
	MusicScene.addChild(diffNumber);
	
	// Informationラベル
	var infLabel = new Label("Information");
	with(infLabel){
		x=cvsize[0]*0.375;
		y=cvsize[1]*0.55;
		color="white";
		font="30px 'Lobster' , sursive"
	}
	MusicScene.addChild(infLabel);
	
	// 楽曲決定画面
	
	// ステージ表記
	var dsStage = new Label();
	dsStage.x = 0;
	dsStage.y = cvsize[1]*0.1;
	dsStage.color = "white";
	dsStage.font = "40px 'Lobster' , sursive";
	dsStage.textAlign = "center";
	dsStage.width=cvsize[0];
	dsStage.addEventListener('enterframe',function(){
		if(singleMode){
			this.text="Speed Twister";
		}else if(ExtraStage==0){
			this.text="Free Stage";
		}else if(ExtraStage==1){
			this.text="Extra Stage";
		}else if(ExtraStage==2){
			this.text="One More Extra Stage";
		}
	});
	DecisionScene.addChild(dsStage);

	// 選択曲名表示ラベル
	var dsMusic = new Label();
	dsMusic.x=0;
	dsMusic.y=cvsize[1]*0.3;
	dsMusic.width=cvsize[0];
	dsMusic.height=cvsize[1]*0.15;
	dsMusic.textAlign = "center";
	dsMusic.color = "white";
	dsMusic.font = "80px 'Rounded Mplus 1c'";
	dsMusic.addEventListener('enterframe',function(){
		this.text=ViewMusic[SelectNum][dfn];
	});
	DecisionScene.addChild(dsMusic);
	
	// アーティスト名表示ラベル
	var dsArtist = new Label();
	dsArtist.x=cvsize[0]*0.5;
	dsArtist.y=dsMusic.y-cvsize[1]*0.05;
	dsArtist.width=cvsize[0]*0.4;
	dsArtist.textAlign="right";
	dsArtist.color="white";
	dsArtist.font = "40px 'Rounded Mplus 1c'";
	dsArtist.addEventListener('enterframe',function(){
		this.text=MusicArtist[SelectNum];
	});
	DecisionScene.addChild(dsArtist);
	
	// 演出用ライン
	var dsLine = new Sprite();
	dsLine.x = 0;
	dsLine.y = cvsize[1]*0.425;
	dsLine.width=cvsize[0];
	dsLine.height=2;
	dsLine.backgroundColor="white";
	DecisionScene.addChild(dsLine);
	
	// 難易度表示ラベル
	var dsDiff = new Label();
	dsDiff.x = cvsize[0]*0.1;
	dsDiff.y = dsArtist.y;
	dsDiff.width = cvsize[0]*0.4;
	dsDiff.font= "40px 'Rounded Mplus 1c'";
	dsDiff.color="white";
	dsDiff.textAlign = "left";
	dsDiff.addEventListener('enterframe',function(){
		this.text = DiffName[SelectNum][dfn] + " / " + KeyNum[SelectNum][dfn] + "keys";
	});
	DecisionScene.addChild(dsDiff);
	
	// Hi-Speed表示ラベル
	var dsHisp = new Label();
	dsHisp.x = cvsize[0]*0.6;
	dsHisp.y = cvsize[1]*0.6;
	dsHisp.width=cvsize[0]*0.4;
	dsHisp.font = "40px 'Lobster' , sursive";
	dsHisp.color="white";
	dsHisp.addEventListener('enterframe',function(){
		this.text=HispLabel.text;
	});
	DecisionScene.addChild(dsHisp);
	
	// Reverse表示ラベル
	var dsRevs =new Label();
	dsRevs.x = cvsize[0]*0.6;
	dsRevs.y = cvsize[1]*0.675;
	dsRevs.width=cvsize[0]*0.4;
	dsRevs.font = "40px 'Lobster' , sursive";
	dsRevs.color = "white";
	dsRevs.addEventListener('enterframe',function(){
		this.text=RevsLabel.text;
	});
	DecisionScene.addChild(dsRevs);
	
	// ゲージモード表示ラベル
	var dsGmod =new Label();
	dsGmod.x = cvsize[0]*0.6;
	dsGmod.y = cvsize[1]*0.75;
	dsGmod.width=cvsize[0]*0.4;
	dsGmod.font = "40px 'Lobster' , sursive";
	dsGmod.color = "white";
	dsGmod.addEventListener('enterframe',function(){
		this.text=GmodLabel.text;
	});
	DecisionScene.addChild(dsGmod);
	
	// 読み込み中表示ラベル
	var dsLoading = new Label("Now Loading...");
	dsLoading.x=cvsize[0]/2;
	dsLoading.y=cvsize[1]/2;
	dsLoading.font = "40px 'Lobster' , sursive";
	dsLoading.textAlign = "center";
	dsLoading.color="white";
	dsLoading.count=0;
	dsLoading.addEventListener('enterframe',function(){
		if(this.count==5){
			this.visible = !this.visible;
			this.count=0;
		}else{
			this.count++;
		}
	});
	DecisionScene.addChild(dsLoading);
	
	// フレーム間処理
	// 読込完了フラグが立てば譜面配置処理へ移行
	DecisionScene.addEventListener('enterframe',function(){
		if(MusicLoading==true){
			MusicLoading=false;
			game.popScene();
			game.pushScene(LoadingScene);
		}
	});
	
	// MusicLoadingシーン
	// 実際は譜面配置処理

	// 矢印クラス
	var Arrows = Class.create(Sprite,{
		initialize: function(lnum,ypt,nnum,jdp,lng){
			// おにぎり判別
			// 5key時にレーン番号4 7key時にレーン番号3であればおにぎりフラグを立てる。
			if((KeyNum[SelectNum][dfn] == 5 && lnum == 4) || (KeyNum[SelectNum][dfn] == 7 && lnum == 3)){
				Sprite.call(this,defsize*1.6,defsize);
				this.oni=true;
			}else{
				Sprite.call(this,defsize,defsize);
				this.oni=false;
			}
			// フリーズアローであれば矢印画像を2個生成。それ以外は1個生成。
			// 作成した矢印は画像番号で管理。
			if(lng>=0){
				this.imtmp = ArsAdded(colors[lnum][1],true,this.oni,colors[lnum][2]);
				this.imtmp2= ArsAdded(colors[lnum][1],true,this.oni,colors[lnum][3]);
			}else{
				this.imtmp = ArsAdded(colors[lnum][0],false,this.oni,0);
			}
			this.image = ArrowSurfaces[this.imtmp];	// 作成した矢印をスプライトに割り当て。
			this.rotation = KeyRole(lnum);			// 角度は矢印生成時に決定。
			this.scaleX = arsize/defsize;			// 矢印サイズはスケール変数で調整。
			this.scaleY = arsize/defsize;
			this.dyp = ypt;							// 初期Y座標（1倍速時）
			this.fnm = jdp;							// 判定フレーム番号
			this.anm = nnum;						// 矢印番号（判定用）
			this.knum = lnum;						// レーン番号
			this.larw = lng >= 0 ? lng+1 : 0;		// フリーズアロー判断。フリーズ判断変数が0以上であればn+1を代入。そうでなければ0を代入。
			this.lbol = false;						// フリーズアロー時の押下判定
			this.chk = true;						// 判定処理待ちフラグ
			this.visible = false;					// 矢印生成時は非表示
			this.efct = false;						// 判定エフェクト（マターリ以上でtrueを立てる）
			this.opacity = 1;						// 透過率　エフェクト発生時に使用
			this.offpress = 2;						// フリーズアロー時、キーが離された際のミス判定余剰
			this.reslt = 0;							// 判定結果格納変数
			this.jdgnm = 0;							// 判定結果格納変数
			// 初期矢印Y座標登録処理
			if(rvs == 0){
				this.y = (this.dyp * hsp) + cvsize[1]*0.1 + ((defsize-arsize)/2);
			}else{
				this.y = cvsize[1]*0.9-arsize-(this.dyp * hsp) + ((defsize-arsize)/2);
			}
			// 矢印X座標登録処理
			this.x = setYpoint(lnum);
			// 判定処理
			this.jdg=function(){
				// 判定待ち状態でありゲームオーバーでない場合に実行。
				if(this.chk && !gameOver){
					var jdgtmp = this.fnm - PrevFrame;	// 現在フレームと判定フレームの差異を取得
					if(jdgtmp <= 10 || this.lbol){	// フレームの差異が10以下であれば判定開始
						// オートプレイ処理
						// オートプレイ中は判定フレーム到達時に効果音が発生
						if(autoplay){
							gch(5);
							JudgeSprite.vwjdg(5);
							ComboSprite.vwcmb();
							game.assets['se/nc132595.wav'].currentTime=0;
							game.assets['se/nc132595.wav'].play();
						}else{
							var jdd = Math.abs(jdgtmp);	// 絶対値の取得
							var jch = false;			// 判定完了フラグ準備
							for(var n=0;n<4;n++){
								if(bjd[n] >= jdd){	// 基準となる数値を下回れば判定処理を完了させる。
									gch(n);
									ComboSprite.vwcmb();	// コンボ表示
									JudgeSprite.vwjdg(n);	// 判定表示
									jch = true;				// 判定完了フラグを立てる。
									// 単独矢印で且つマターリ以上であればエフェクト有効化処理開始。
									// 単独矢印で且つミス判定であれば矢印を画面から削除。
									if((this.larw == 0 || this.larw-1 < this.anm) && n < 3){
										if(!autoplay){
											this.efct = true;
											this.reslt = 3-n;
										}else{
											this.parentNode.removeChild(this);
										}
									}
									this.jdgnm = n;	// 判定結果格納
									break;
								}
							}
							// ウワァァン判定
							if(!jch){
								gch(4);
								JudgeSprite.vwjdg(4);
								ComboSprite.vwcmb();
							}
						}
						if(this.larw>0){　// フリーズアロー処理
							this.lbol = !this.lbol; //フリーズアロー時の押下判定フラグの反転
							arrowSprites[this.larw-1].lbol = this.lbol;	// 対となる矢印の押下判定フラグを同期
							if(this.lbol  == false){	// 押下判定フラグが偽であるとき、透過率を100%にする。
								arrowSprites[this.larw-1].opacity = 0;
							}
							// オートプレイで終端判定が無効である場合、上位のボタン押下判定を反転させる。
							if(!LongMode[SelectNum][dfn] && autoplay){
								btnpl[this.knum] = !btnpl[this.knum];
							}
							// オートプレイで終端判定が無効であり、上位のボタン押下判定が偽である場合、矢印を画面から削除。
							if(!LongMode[SelectNum][dfn] && autoplay && !btnpl[this.knum]){
								this.parentNode.removeChild(this);
							}
						}else{ // 通常矢印処理
							// オートプレイであればエフェクト有無を問わず矢印を画面から削除 
							if(autoplay){
								this.parentNode.removeChild(this);
							}
						}
						// エフェクトが無効で押下判定フラグが無効であるとき、透過率を50%にする。
						if(!this.efct && !this.lbol){
							this.opacity = 0.5;
						}
						nowaw[this.knum]++;	// レーン別矢印判定変数の加算
						this.chk = false;	// 判定待ち状態解除
					}
				}
			};
			// パーフェクト判定
			this.pjg = function(){
				gch(0);
				JudgeSprite.vwjdg(0);
				ComboSprite.vwcmb();
				this.efct = true;
				this.reslt = 3;
				nowaw[this.knum]++;
				this.lbol = false;
				if(this.larw > 0 && arrowSprites[this.larw-1].lbol){
					arrowSprites[this.larw-1].lbol = false;
				}
				this.chk = false;
			}
			// ミス判定
			this.mjg = function(){
				gch(4);
				JudgeSprite.vwjdg(4);
				ComboSprite.vwcmb();
				this.opacity = 0.5;
				nowaw[this.knum]++;
				this.lbol = false;
				if(this.larw > 0 && arrowSprites[this.larw-1].lbol){
					arrowSprites[this.larw-1].lbol = false;
				}
				this.chk = false;
			}
		},
		onenterframe:	function(){
			if((!this.lbol && !this.efct) || (this.chk && this.lbol) ){
				if(rvs == 0){
					this.y = arrowChecks[this.knum].y+(this.dyp*hsp) - (ArrowMove * hsp) + ((defsize-arsize)/4) + corarr;
				}else {
					this.y = arrowChecks[this.knum].y-(this.dyp*hsp) + (ArrowMove * hsp) + ((defsize-arsize)/4) + corarr;
				}
			}else if(!this.chk && this.lbol){
				this.image = ArrowSurfaces[this.imtmp2];
				this.y = arrowChecks[this.knum].y +((defsize-arsize)/4) + corarr;
			}else if(!this.chk && !this.lbol && !this.efct){
				this.parentNode.removeChild(this);
			}
			if(this.efct){
				this.scaleX += (this.reslt*5)*0.01;
				this.scaleY += (this.reslt*5)*0.01;
				this.opacity -=0.1;
				if(this.opacity <= 0){
					this.parentNode.removeChild(this);
				}
			}
			if(!LongMode[SelectNum][dfn] && this.larw > 0 && this.chk && !arrowSprites[this.larw-1].chk){
				if(btnpl[this.knum]){
					if(this.offpress < 2) this.offpress++;
					if(this.fnm-PrevFrame < 1){
						if(autoplay){
							this.jdg();
						}else{
							this.pjg();
						}
					}
				}else if(!btnpl[this.knum]){
					this.offpress--;
					if(this.offpress<=0){
						this.jdg();
					}else if(this.fnm-PrevFrame < 1){
						this.pjg();
					}
				}
				
			}
			if(this.fnm-PrevFrame <1 && autoplay && this.chk){
				arrowChecks[this.knum].scales=2;
				this.jdg();
			}
			if(PrevFrame-this.fnm > 10 && this.chk){
				this.mjg();
				if(this.larw > 0 && this.larw >= arrowSprites[this.larw-1].larw){
					arrowSprites[this.larw-1].mjg();
				}
			}
			if(this.y >= 0 - arsize && this.y <= cvsize[1] + arsize){
				this.visible = true;
			}else if(this.visible && this.y < 0 - arsize && this.y > cvsize[1] + arsize){
				if(!this.lbol){
					this.visible = false;
				}else if(this.efct){
				
				}else{
					this.parentNode.removeChild(this);
				}
			}
		}
	});
	
	var LongClass = Class.create(Sprite,{
		initialize: function(lnum,yst,yed,tnum,unum){
			if((KeyNum[SelectNum][dfn] == 5 && lnum == 4) || (KeyNum[SelectNum][dfn] == 7 && lnum == 3)){
				Sprite.call(this,defsize*1.6,1);
				this.onigiri = 20+((defsize-arsize)/2);
				this.onix = 1;
			}else{
				Sprite.call(this,defsize,1);
				this.onigiri = (defsize-arsize)/2;
				this.onix = 0;
			}
			this.scaleX = arsize/defsize;
			this.image = LongLine;
			this.height = (yed-yst)*hsp;
			this.knum = lnum;
			this.dyp = yst;
			this.anum = tnum;
			this.dnum = unum;
			this.cngback = false;
			this.chk=0;
			this.backgroundColor = colors[lnum][4];
			if(rvs ==0){
				this.y = (this.dyp * hsp) - (ArrowMove * hsp) + (cvsize[1] * 0.1) + (arsize/2) + this.onigiri -((defsize-arsize)/2); 
			}else{
				this.y = this.y = cvsize[1]*0.9-arsize-(this.dyp*hsp) + (ArrowMove * hsp) + (arsize/2) - this.height + this.onigiri - ((defsize-arsize)/2);
			}
			this.x = setYpoint(lnum)+this.onix;
		},
		onenterframe:	function(){
			if(!arrowSprites[this.anum].chk && !this.cngback){
				this.backgroundColor = colors[this.knum][5];
				this.cngback=true;
			}
			if(arrowSprites[this.anum].chk || arrowSprites[this.dnum].chk){
				if(rvs==0){
					this.height = arrowSprites[this.dnum].y - arrowSprites[this.anum].y;
					this.y = arrowSprites[this.anum].y + arsize/2+ this.onigiri;
				}else {
					this.height = arrowSprites[this.anum].y - arrowSprites[this.dnum].y;
					this.y = arrowSprites[this.dnum].y + arsize/2+ this.onigiri;
				}
				if(this.height <= 0){
					this.parentNode.removeChild(this);
				}
			}else{
				this.parentNode.removeChild(this);
			}
		}
	});
	
	var JudgeString = Class.create(Label,{
		initialize:	function(){
			Label.call(this);
			this.x = cvsize[0]*0.1;
			this.y = cvsize[1]*0.45;
			this.width = cvsize[0]*0.4;
			this.count = 0;
			this.max = 90;
			this.visible = false;
			this.align = "right";
			this.textAlign = "right";
			this.font = (cvsize[0]/30)+"px 'ＭＳ Ｐゴシック', 'MS PGothic', 'MS Pｺﾞｼｯｸ', 'MS Pゴシック', ＭＳＰゴシック, MSPゴシック, IPAMonaPGothic, 'IPA モナー Pゴシック', 'IPA mona PGothic', 'IPA MONAPGOTHIC',Mona,Monapo, Saitamaar, sans-serif";
			this.vwjdg = function(jnum){
				this.text = jdgst[jnum];
				this.color = jdgcl[jnum];
				this.count = this.max;
				this.visible = true;
			};
		},
		onenterframe:	function(){
			if(this.count == 0){
				this.visible = false;
			}else{
				this.count--;
				if(this.count % 2 == 0){
					this.visible = !this.visible;
				}
			}
		}
	});
	var ComboString = Class.create(Label,{
		initialize:	function(){
			Label.call(this);
			this.x = cvsize[0]*0.55;
			this.y = JudgeSprite.y;
			this.width = cvsize[0]*0.3;
			this.visible = false;
			this.align = "center";
			this.textAlign = "left";
			this.font = (cvsize[0]/30)+"px 'Lobster' , sursive";
			this.color = "#FFFFFF";
			this.vwcmb = function(){
				this.text = ncb;
				this.count = this.max;
			}
		},
		onenterframe:	function(){
			if(ncb == 0 || !JudgeSprite.visible){
				this.visible = false;
			}else{
				this.visible = JudgeSprite.visible;
			}
		}
	});
	var ScoreString = Class.create(Label,{
		initialize:	function(){
			Label.call(this);
			this.width = cvsize[0];
			this.visible = true;
			this.align = "left";
			this.textAlign = "left";
			this.font = (cvsize[0]/40)+"px 'Lobster' , sursive";
			this.color = "#FFFFFF";
			this.scrvw = 0;
			this.nwscr = 0;
			this.yfc = function(){
				this.y = rvs == 0 ? cvsize[1]*0.9 : cvsize[1]*0.1;
			};
		},
		onenterframe:	function(){
			this.nwscr = Math.floor(msc * ((jdn[0]*10+jdn[1]*5+jdn[2]*1)/(noteNum*10)));
			if(this.nwscr - this.scrvw > 10000){
				this.scrvw += 11111;
			}else if(this.nwscr - this.scrvw > 1000){
				this.scrvw += 1111;
			}else if(this.nwscr - this.scrvw > 100){
				this.scrvw += 111;
			}else if(this.nwscr - this.scrvw > 10){
				this.scrvw+=11;
			}else if (this.scrvw < this.nwscr){
				this.scrvw++;
			}else if (this.scrvw > this.nwscr){
				this.scrvw =  this.nwscr;
			}else if(this.nwscr == 0){
				this.scrvw = 0;
			}
			this.text = " Score : " + this.scrvw;
		}
	});
	var MaxcbString = Class.create(Label,{
		initialize: function(){
			Label.call(this);
			this.width = cvsize[0];
			this.visible = true;
			this.align = "left";
			this.font = (cvsize[0]/40)+"px 'Lobster' , sursive";
			this.color = "#FFFFFF";
			this.yfc = function(){
				this.y = rvs==0 ? cvsize[1]*0.85 : cvsize[1]*0.15;
			};
		},
		onenterframe:	function(){
			this.text = "MaxCombo : "+mcb;
		}
	});
	
	var LifeGauge = Class.create(Sprite,{
		initialize:	function(lnum){
			Sprite.call(this,cvsize[0]*0.01,cvsize[1]*0.08);
			this.x = cvsize[0]*0.25 + (lnum * this.width);
			this.lmem = lnum;
			this.yfc = function(){
				this.y = rvs == 0 ? 0 : this.y = cvsize[1]-this.height;
			}
		},
		onenterframe:	function(){
			if(cgg[gmd] <= (this.lmem*2)/100){
				if(ngg/mgg >= (this.lmem*2)/100){
					this.backgroundColor = "#FF0000";
				}else{
					this.backgroundColor = "#660000";
				}
			}else{
				if(ngg/mgg >= (this.lmem*2)/100){
					this.backgroundColor = "#00FF00";
				}else{
					this.backgroundColor = "#006600";
				}
			}
		}
	});
	
	var GameOverClass = Class.create(Label,{
		initialize:	function(){
			Label.call(this);
			this.text = "Game Over ...";
			this.x = 0;
			this.y = cvsize[1]*0.3;
			this.width = cvsize[0];
			this.font = (cvsize[0]/10)+"px 'Lobster' , sursive";
			this.color = "#FF0000";
			this.textAlign = "center"; 
			this.opacity = 0;
		},
		onenterframe:	function(){
			if(gameOver){
				if(this.opacity < 1){
					this.opacity += 0.02;
				}else{
					this.opacity = 1;
				}
			}else{
				this.opacity = 0;
			}
		}
	});
	
	var checkSprite = Class.create(Sprite,{
		initialize: function(knum){
			if((KeyNum[SelectNum][dfn] == 5 && knum == 4) || (KeyNum[SelectNum][dfn] == 7 && knum == 3)){
				Sprite.call(this,defsize*1.6,defsize);
				this.imtmp1 = ArsAdded("#666666",false,true);
				this.imtmp2 = ArsAdded("#00FFFF",false,true);
				this.image = ArrowSurfaces[this.imtmp1];
			}else{
				Sprite.call(this,defsize,defsize);
				this.imtmp1 = ArsAdded("#666666",false,false);
				this.imtmp2 = ArsAdded("#00FFFF",false,false);
				this.image = ArrowSurfaces[this.imtmp1];
				this.rotation = KeyRole(knum);
			}
			this.scaleX = arsize/defsize;
			this.scaleY = arsize/defsize;
			this.y = rvs == 0 ? cvsize[1] * 0.1 - ((defsize-arsize)/2) : cvsize[1] * 0.9 - arsize - ((defsize-arsize)/2);
			this.x = setYpoint(knum);
			this.keynum = knum;
			this.scales = 1;
			this.endcheck = function(){
				this.removeEventListener(this.keynum+'buttondown',arguments.callee);
				this.removeEventListener(this.keynum+'buttonup',arguments.callee);
			};
		},
		onenterframe: function(){
			
			if(autoplay){
				if(this.scales>1){
					this.scales-=0.2;
					this.image = ArrowSurfaces[this.imtmp2];
				}else{
					this.scales=1;
					this.image = ArrowSurfaces[this.imtmp1];
				}
				this.scaleX = (arsize/defsize)*this.scales;
				this.scaleY = (arsize/defsize)*this.scales;
			}else{
				if(btnpl[this.keynum]){
					this.image = ArrowSurfaces[this.imtmp2];
				}else{
					this.image = ArrowSurfaces[this.imtmp1];
				}
			}
		}
	});
	
	var keysClass = Class.create(Sprite,{
		initialize:function(knum){
			if((KeyNum[SelectNum][dfn] == 5 && knum == 4) || (KeyNum[SelectNum][dfn] == 7 && knum == 3)){
				Sprite.call(this,200,400);
				this.image = game.assets['onikeyoff.png'];
				this.tocon = 'onikeyon.png';
				this.tocoff = 'onikeyoff.png';
			}else{
				Sprite.call(this,125,400);
				this.image = game.assets['7keyoff.png'];
				this.tocon = '7keyon.png';
				this.tocoff = '7keyoff.png';
			}
			this.y = cvsize[1]-this.height-5;
			this.keynum = knum;
			this.x = setYpoint(knum);
			if(userAgent.indexOf('android') != -1 || userAgent.indexOf('iphone') != -1 || userAgent.indexOf('ipad') != -1){
				this.visible = true;
			}else{
				this.visible = false;
			}
		},
		ontouchstart:function(){
			if(!arrowSprites[chkaw[this.keynum][nowaw[this.keynum]]].lbol && !autoplay){
				arrowSprites[chkaw[this.keynum][nowaw[this.keynum]]].jdg();
			}
			this.image = game.assets[this.tocon];
			btnpl[this.keynum] = true;
		},
		ontouchend:function(){
			if(arrowSprites[chkaw[this.keynum][nowaw[this.keynum]]].lbol && !autoplay){
				arrowSprites[chkaw[this.keynum][nowaw[this.keynum]]].jdg();
			}
			this.image = game.assets[this.tocoff];
			btnpl[this.keynum] = false;
		}
	});

	var arrowSprites;
	var longsSprites;
	var arrowChecks;
	var JudgeSprite;
	var ComboSprite;
	var ScoreSprite;
	var MaxcbSprite;
	var LifeSprite;
	var GameOverLabel;
	var keysSprites;
	
	LoadingScene.addEventListener('enter',function(){
		arrowChecks = new Array();
		for(var i = 0;i<KeyNum[SelectNum][dfn];i++){
			arrowChecks[i] = new checkSprite(i);
			PlayingScene.addChild(arrowChecks[i]);
			if(KeyNum[SelectNum][dfn]==5||(KeyNum[SelectNum][dfn]==7&&i%2==0)){
				colors[i]=defcolor[SelectNum][0].slice();
			}else{
				colors[i]=defcolor[SelectNum][1].slice();
			}
		}
		keysSprites = new Array();
		arrowSprites = null;
		longsSprites = null;
		arrowSprites = new Array();
		longsSprites = new Array();
		var tmpAry = new Array();
		nowaw = [0,0,0,0,0,0,0];
		notmx = [0,0,0,0,0,0,0];
		chkaw = [[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
		chklg = [[],[],[],[],[],[],[]];
		var nomlaw = [0,0,0,0,0,0,0];
		var longaw = [0,0,0,0,0,0,0];
		var longar = [0,0,0,0,0,0,0];
		btnpl = [false,false,false,false,false,false,false];
		noteNum = 0;
		var bpmtmp = StartBPM[SelectNum][dfn];
		var spdtmp = 1;
		bpmcnt = 0;
		spdcng = 0;
		longCnt = 0;
		var ypoint = 0;
		var ymove = 0;
		var longtmp = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
		var cordeg = cor < 0 ? cor : 0;
		if(cordeg<0){
			ypoint+=(frameMove*(bpmtmp/100)*spdtmp)*cordeg;
		}
		for (var i=cordeg;i<=Math.round(game.assets["mp3/"+MusicFile[SelectNum][SelectMusic[SelectNum][dfn]]].duration*game.fps);i++){
			for(var j = 0;j<KeyNum[SelectNum][dfn];j++){
				if(i == ArrowSets[SelectNum][dfn][j][nomlaw[j]]-frameAdjust[SelectNum][dfn]+cor){
					arrowSprites[noteNum] = new Arrows(j,ypoint,noteNum,i,-999);
					chkaw[j][nowaw[j]] = noteNum;
					noteNum++;
					nowaw[j]++;
					notmx[j]++;
					nomlaw[j]++;
				}
			}
			for(var j = 0;j<KeyNum[SelectNum][dfn];j++){
				if(i == ArrowSets[SelectNum][dfn][j+KeyNum[SelectNum][dfn]][longaw[j]]-frameAdjust[SelectNum][dfn]+cor){
					if(longtmp[j][0] == 0){
						longtmp[j][0] = i;
						longtmp[j][1] = ypoint;
						longtmp[j][2] = noteNum;
						longaw[j]++;
						noteNum++;
						
					}else{
						longsSprites[longCnt] = new LongClass(j,longtmp[j][1],ypoint,longtmp[j][2],noteNum);
						arrowSprites[longtmp[j][2]] = new Arrows(j,longtmp[j][1],longtmp[j][2],longtmp[j][0],noteNum);
						arrowSprites[noteNum] = new Arrows(j,ypoint,noteNum,i,longtmp[j][2]);
						chkaw[j][nowaw[j]] = longtmp[j][2];
						nowaw[j]++;
						notmx[j]++;
						chkaw[j][nowaw[j]] = noteNum;
						nowaw[j]++;
						notmx[j]++;
						chklg[j][longar[j]] = longCnt;
						longtmp[j] = [0,0,0];
						longaw[j]++;
						longar[j]++;
						noteNum++;
						longCnt++;
					}
				}
			}
			if(ArrowSets[SelectNum][dfn][KeyNum[SelectNum][dfn]*2].length>1){
				if(i == ArrowSets[SelectNum][dfn][KeyNum[SelectNum][dfn]*2][bpmcnt*2]+frameAdjust[SelectNum][dfn]+cor){
					if(i!=0){
						bpmtmp = ArrowSets[SelectNum][dfn][KeyNum[SelectNum][dfn]*2][bpmcnt*2+1];
						chbpm[bpmcnt] = [i,bpmtmp];
						bpmcnt++;
					}
				}
			}
			if(ArrowSets[SelectNum][dfn][KeyNum[SelectNum][dfn]*2+1].length>1){
				if(i == ArrowSets[SelectNum][dfn][KeyNum[SelectNum][dfn]*2+1][spdcng*2]+frameAdjust[SelectNum][dfn]+cor){
					if(i!=0){
						spdtmp = ArrowSets[SelectNum][dfn][KeyNum[SelectNum][dfn]*2+1][spdcng*2+1];
						chhsp[spdcng] = [i,spdtmp];
						spdcng++;
					}
				}
			}
			ypoint+=frameMove*(bpmtmp/100)*spdtmp;
		}
		for(var i = 0;i < KeyNum[SelectNum][dfn];i++){
			chkaw[i][nowaw[i]] = 0;
			chklg[i][longar[i]] = 0;
		}
		mgg = noteNum;
		ngg = mgg * sgg[gmd];
		jdn = [0,0,0,0,0,0];
		mcb = 0;
		ncb = 0;
		ScoreSprite.yfc();
		MaxcbSprite.yfc();
		for(var i = 0;i<50;i++){
			LifeSprite[i].yfc();
		}
		chhsp[spdcng] = [0,0];
		chbpm[bpmcnt] = [0,0];
		nowaw = [0,0,0,0,0,0,0];
		gameOver = false;
		var ktmp = KeyNum[SelectNum][dfn] == 5 ? 0 : 1;
		game.keybind(keycodes[ktmp][0],'0');
		game.keybind(keycodes[ktmp][1],'1');
		game.keybind(keycodes[ktmp][2],'2');
		game.keybind(keycodes[ktmp][3],'3');
		game.keybind(keycodes[ktmp][4],'4');
		if(ktmp==1)game.keybind(keycodes[ktmp][5],'5');
		if(ktmp==1)game.keybind(keycodes[ktmp][6],'6');
		game.keybind(keyopt[0],'d');
		game.keybind(keyopt[1],'u');
		game.keybind(keyopt[2],'g');
		var keytemp = KeyNum[SelectNum][dfn] == 5 ? 0 : 1;
		for(var i = 0;i<KeyNum[SelectNum][dfn];i++){
			keysSprites[i] = new keysClass(i);
			game.keybind(keycodes[keytemp][i],i);
			PlayingScene.addChild(keysSprites[i]);
			for(var j = 0; j<50;j++){
				PlayingScene.insertBefore(LifeSprite[j],arrowSprites[chkaw[i][setaw[i]]]);
			}
			PlayingScene.insertBefore(JudgeSprite,arrowSprites[chkaw[i][setaw[i]]]);
			PlayingScene.insertBefore(ComboSprite,arrowSprites[chkaw[i][setaw[i]]]);
			PlayingScene.insertBefore(ScoreSprite,arrowSprites[chkaw[i][setaw[i]]]);
			PlayingScene.insertBefore(MaxcbSprite,arrowSprites[chkaw[i][setaw[i]]]);
			PlayingScene.insertBefore(GameOverLabel,JudgeSprite);
			PlayingScene.insertBefore(GamePause,arrowSprites[chkaw[i][setaw[i]]]);
			PlayingScene.insertBefore(gpLabel,arrowSprites[chkaw[i][setaw[i]]]);
			PlayingScene.insertBefore(gpOption,arrowSprites[chkaw[i][setaw[i]]]);
			PlayingScene.insertBefore(gpCorLabel,arrowSprites[chkaw[i][setaw[i]]]);
			PlayingScene.insertBefore(gpCorDown,arrowSprites[chkaw[i][setaw[i]]]);
			PlayingScene.insertBefore(gpCorUp,arrowSprites[chkaw[i][setaw[i]]]);
			PlayingScene.insertBefore(gpHispLabel,arrowSprites[chkaw[i][setaw[i]]]);
			PlayingScene.insertBefore(gpHispDown,arrowSprites[chkaw[i][setaw[i]]]);
			PlayingScene.insertBefore(gpHispUp,arrowSprites[chkaw[i][setaw[i]]]);
			PlayingScene.insertBefore(gpRetryLabel,arrowSprites[chkaw[i][setaw[i]]]);
			PlayingScene.insertBefore(gpRetryButton,arrowSprites[chkaw[i][setaw[i]]]);
			PlayingScene.insertBefore(gpRetireLabel,arrowSprites[chkaw[i][setaw[i]]]);
			PlayingScene.insertBefore(gpRetireButton,arrowSprites[chkaw[i][setaw[i]]]);
		}
		game.popScene();
		game.pushScene(PlayingScene);
	});
	
	
	PlayingScene.addEventListener('0buttondown',function(){
		if(!arrowSprites[chkaw[0][nowaw[0]]].lbol && !autoplay){
			arrowSprites[chkaw[0][nowaw[0]]].jdg();
		}
		btnpl[0] = true;
	});
	PlayingScene.addEventListener('0buttonup',function(){
		if(arrowSprites[chkaw[0][nowaw[0]]].lbol && !autoplay && LongMode[SelectNum][dfn]){
			arrowSprites[chkaw[0][nowaw[0]]].jdg();
		}
		btnpl[0] = false;
	});
	PlayingScene.addEventListener('1buttondown',function(){
		if(!arrowSprites[chkaw[1][nowaw[1]]].lbol && !autoplay){
			arrowSprites[chkaw[1][nowaw[1]]].jdg();
		}
		btnpl[1] = true;
	});
	PlayingScene.addEventListener('1buttonup',function(){
		if(arrowSprites[chkaw[1][nowaw[1]]].lbol && !autoplay && LongMode[SelectNum][dfn]){
			arrowSprites[chkaw[1][nowaw[1]]].jdg();
		}
		btnpl[1] = false;
	});
	PlayingScene.addEventListener('2buttondown',function(){
		if(!arrowSprites[chkaw[2][nowaw[2]]].lbol && !autoplay){
			arrowSprites[chkaw[2][nowaw[2]]].jdg();
		}
		btnpl[2] = true;
	});
	PlayingScene.addEventListener('2buttonup',function(){
		if(arrowSprites[chkaw[2][nowaw[2]]].lbol && !autoplay && LongMode[SelectNum][dfn]){
			arrowSprites[chkaw[2][nowaw[2]]].jdg();
		}
		btnpl[2] = false;
	});
	PlayingScene.addEventListener('3buttondown',function(){
		if(!arrowSprites[chkaw[3][nowaw[3]]].lbol && !autoplay){
			arrowSprites[chkaw[3][nowaw[3]]].jdg();
		}
		btnpl[3] = true;
	});
	PlayingScene.addEventListener('3buttonup',function(){
		if(arrowSprites[chkaw[3][nowaw[3]]].lbol && !autoplay && LongMode[SelectNum][dfn]){
			arrowSprites[chkaw[3][nowaw[3]]].jdg();
		}
		btnpl[3] = false;
	});
	PlayingScene.addEventListener('4buttondown',function(){
		if(!arrowSprites[chkaw[4][nowaw[4]]].lbol && !autoplay){
			arrowSprites[chkaw[4][nowaw[4]]].jdg();
		}
		btnpl[4] = true;
	});
	PlayingScene.addEventListener('4buttonup',function(){
		if(arrowSprites[chkaw[4][nowaw[4]]].lbol && !autoplay && LongMode[SelectNum][dfn]){
			arrowSprites[chkaw[4][nowaw[4]]].jdg();
		}
		btnpl[4] = false;
	});
	PlayingScene.addEventListener('5buttondown',function(){
		if(!arrowSprites[chkaw[5][nowaw[5]]].lbol && !autoplay){
			arrowSprites[chkaw[5][nowaw[5]]].jdg();
		}
		btnpl[5] = true;
	});
	PlayingScene.addEventListener('5buttonup',function(){
		if(arrowSprites[chkaw[5][nowaw[5]]].lbol && !autoplay && LongMode[SelectNum][dfn]){
			arrowSprites[chkaw[5][nowaw[5]]].jdg();
		}
		btnpl[5] = false;
	});
	PlayingScene.addEventListener('6buttondown',function(){
		if(!arrowSprites[chkaw[6][nowaw[6]]].lbol && !autoplay){
			arrowSprites[chkaw[6][nowaw[6]]].jdg();
		}
		btnpl[6] = true;
	});
	PlayingScene.addEventListener('6buttonup',function(){
		if(arrowSprites[chkaw[6][nowaw[6]]].lbol && !autoplay && LongMode[SelectNum][dfn]){
			arrowSprites[chkaw[6][nowaw[6]]].jdg();
		}
		btnpl[6] = false;
	});
	PlayingScene.addEventListener('dbuttondown',function(){
		if(hsp > 0.25){
			hsp-=0.25;
		}
	});
	PlayingScene.addEventListener('ubuttondown',function(){
		if(hsp < 5){
			hsp+=0.25;
		}
	});
	PlayingScene.addEventListener('gbuttondown',function(){
		if(!gameOver && StartWait==0){
			game.assets["mp3/"+MusicFile[SelectNum][SelectMusic[SelectNum][dfn]]].pause();
			gameps = true;
		}
	});
	// ゲーム画面
	JudgeSprite = new JudgeString();
	JudgeSprite.count=0;
	ComboSprite = new ComboString();
	ScoreSprite = new ScoreString();
	MaxcbSprite = new MaxcbString();
	GameOverLabel = new GameOverClass();
	LifeSprite = new Array();
	
	for(var i = 0;i<50;i++){
		LifeSprite[i] = new LifeGauge(i);
		PlayingScene.addChild(LifeSprite[i]);
	}
	PlayingScene.addChild(JudgeSprite);
	PlayingScene.addChild(ComboSprite);
	PlayingScene.addChild(ScoreSprite);
	PlayingScene.addChild(MaxcbSprite);
	PlayingScene.addChild(GameOverLabel);
	
	var PauseBack = new Surface(640,320);
	context = PauseBack.context;
	context.beginPath();
	context.rect(0,0,638,318);
	context.lineWidth=2;
	context.strokeStyle="#FFFFFF";
	context.fillStyle="#000000";
	context.fill();
	context.stroke();
	
	var GamePause = new Sprite(640,320);
	GamePause.image = PauseBack;
	GamePause.x = cvsize[0]/2-GamePause.width/2;
	GamePause.y = cvsize[1]/2-GamePause.height/2;
	GamePause.opacity=0;
	GamePause.visible = false;
	GamePause.addEventListener('enterframe',function(){
		if(!gameps){
			this.opacity = 0;
			this.visible = false;
		}else if(this.opacity<1){
			this.visible = true;
			this.opacity+=0.02;
		}else{
			this.opacity=1;
		}
	});
	PlayingScene.addChild(GamePause);
	
	var gpLabel = new Label("Game Stoped .");
	gpLabel.x = GamePause.x;
	gpLabel.y = GamePause.y;
	gpLabel.width = GamePause.width;
	gpLabel.textAlign = "center";
	gpLabel.font = (cvsize[0]/20)+"px 'Lobster' , sursive";
	gpLabel.color = "white";
	gpLabel.addEventListener('enterframe',function(){
		this.visible = GamePause.visible;
		this.opacity = GamePause.opacity;
	});
	PlayingScene.addChild(gpLabel);
	
	var gpOption = new Label("Change Option Menu");
	gpOption.x = GamePause.x;
	gpOption.y = GamePause.y+75;
	gpOption.width = GamePause.width;
	gpOption.textAlign = "center";
	gpOption.font = (cvsize[0]/40)+"px 'Lobster' , sursive";
	gpOption.color = "white";
	gpOption.addEventListener('enterframe',function(){
		this.visible = GamePause.visible;
		this.opacity = GamePause.opacity;
	});
	PlayingScene.addChild(gpOption);
	
	var gpHispDown = new Sprite(cvsize[0]*0.075,cvsize[1]*0.05);
	gpHispDown.image = OptionLeft;
	gpHispDown.x = GamePause.x+20;
	gpHispDown.y = GamePause.y+125;
	gpHispDown.backgroundColor="rgba(255,255,255,0)";
	gpHispDown.addEventListener('touchend',function(){
		if(hsp > 0.25){
			hsp -= 0.25;
		}else{
			hsp = 5;
		}
		
		game.assets['se/pushbutton.mp3'].currentTime=0;
		game.assets['se/pushbutton.mp3'].play();
	});
	gpHispDown.addEventListener('enterframe',function(){
		this.visible = GamePause.visible;
		this.opacity = GamePause.opacity;
	});

	var gpHispUp = new Sprite(cvsize[0]*0.075,cvsize[1]*0.05);
	gpHispUp.image = OptionRight;
	gpHispUp.x = gpHispDown.x+gpHispDown.width-3;
	gpHispUp.y = gpHispDown.y;
	gpHispUp.backgroundColor="rgba(255,255,255,0)";
	gpHispUp.addEventListener('touchend',function(){
		if(hsp < hom){
			hsp+=0.25;
		}else{
			hsp = 0.25;
		}
		
		game.assets['se/pushbutton.mp3'].currentTime=0;
		game.assets['se/pushbutton.mp3'].play();
	});
	gpHispUp.addEventListener('enterframe',function(){
		this.visible = GamePause.visible;
		this.opacity = GamePause.opacity;
	});
	
	var gpHispLabel = new Label();
	gpHispLabel.width = cvsize[0]*0.15;
	gpHispLabel.height = cvsize[1]*0.05;
	gpHispLabel.x = gpHispDown.x;
	gpHispLabel.y = gpHispDown.y;
	gpHispLabel.color = "#fff";
	gpHispLabel.font = (cvsize[1]*0.03)+"px 'Lobster' , sursive";
	gpHispLabel.addEventListener('enterframe',function(){
		gpHispLabel.text = "  Hi-Speed : x" + hsp;
		this.visible = GamePause.visible;
		this.opacity = GamePause.opacity;
	});
	PlayingScene.addChild(gpHispLabel);
	PlayingScene.addChild(gpHispDown);
	PlayingScene.addChild(gpHispUp);
	
	var gpCorDown = new Sprite(cvsize[0]*0.075,cvsize[1]*0.05);
	gpCorDown.image = OptionLeft;
	gpCorDown.x = GamePause.x+gpHispDown.width*2+20;
	gpCorDown.y = GamePause.y+125;
	gpCorDown.backgroundColor="rgba(255,255,255,0)";
	gpCorDown.addEventListener('touchend',function(){
		cor--;
		if(cor == -16){
			cor = 15;
		}
		
		game.assets['se/pushbutton.mp3'].currentTime=0;
		game.assets['se/pushbutton.mp3'].play();
	});
	gpCorDown.addEventListener('enterframe',function(){
		this.visible = GamePause.visible;
		this.opacity = GamePause.opacity;
	});
	
	var gpCorUp = new Sprite(cvsize[0]*0.075,cvsize[1]*0.05);
	gpCorUp.image = OptionRight;
	gpCorUp.x = gpCorDown.x + gpCorDown.width - 3;
	gpCorUp.y = gpCorDown.y;
	gpCorUp.backgroundColor="rgba(255,255,255,0)";
	gpCorUp.addEventListener('touchend',function(){
		cor++;
		if(cor == 16){
			cor = -15;
		}
		
		game.assets['se/pushbutton.mp3'].currentTime=0;
		game.assets['se/pushbutton.mp3'].play();
	});
	gpCorUp.addEventListener('enterframe',function(){
		this.visible = GamePause.visible;
		this.opacity = GamePause.opacity;
	});
	
	var gpCorLabel = new Label();
	gpCorLabel.x = gpCorDown.x;
	gpCorLabel.y = gpCorDown.y;
	gpCorLabel.width = cvsize[0]*0.15;
	gpCorLabel.height = cvsize[1]*0.05;
	gpCorLabel.font = (cvsize[1]*0.03) + "px 'Lobster' , sursive";
	gpCorLabel.color = "#fff";
	gpCorLabel.addEventListener('enterframe',function(){
		this.text = "  Correction : " + cor;
		this.visible = GamePause.visible;
		this.opacity = GamePause.opacity;
	});
	
	PlayingScene.addChild(gpCorLabel);
	PlayingScene.addChild(gpCorDown);
	PlayingScene.addChild(gpCorUp);
	
	var gpRetryButton = new Sprite();
	gpRetryButton.width = OptionButton.width;
	gpRetryButton.height = OptionButton.height;
	gpRetryButton.image = OptionButton;
	gpRetryButton.x = GamePause.x+40;
	gpRetryButton.y = GamePause.y+270;
	gpRetryButton.backgroundColor="rgba(255,255,255,0)";
	gpRetryButton.addEventListener('touchend',function(){
		gpRetry=true;
	});
	gpRetryButton.addEventListener('enterframe',function(){
		this.visible = GamePause.visible;
		this.opacity = GamePause.opacity;
	});
	
	var gpRetryLabel = new Label("Try Again");
	gpRetryLabel.x=gpRetryButton.x;
	gpRetryLabel.y=gpRetryButton.y;
	gpRetryLabel.width = gpRetryButton.width;
	gpRetryLabel.height = gpRetryButton.height;
	gpRetryLabel.font = (cvsize[1]*0.03) + "px 'Lobster' , sursive";
	gpRetryLabel.textAlign = "center";
	gpRetryLabel.color="white";
	gpRetryLabel.addEventListener('enterframe',function(){
		this.visible = GamePause.visible;
		this.opacity = GamePause.opacity;
	});
	
	PlayingScene.addChild(gpRetryLabel);
	PlayingScene.addChild(gpRetryButton);
	
	var gpRetireButton = new Sprite();
	gpRetireButton.width = OptionButton.width;
	gpRetireButton.height = OptionButton.height;
	gpRetireButton.image = OptionButton;
	gpRetireButton.x = GamePause.x+GamePause.width-gpRetireButton.width-40;
	gpRetireButton.y = GamePause.y+270;
	gpRetireButton.backgroundColor="rgba(255,255,255,0)";
	gpRetireButton.addEventListener('touchend',function(){
		gameps=false;
		gameOver=true;
	});
	gpRetireButton.addEventListener('enterframe',function(){
		this.visible = GamePause.visible;
		this.opacity = GamePause.opacity;
	});
	
	var gpRetireLabel = new Label("Retire...");
	gpRetireLabel.x=gpRetireButton.x;
	gpRetireLabel.y=gpRetireButton.y;
	gpRetireLabel.width = gpRetireButton.width;
	gpRetireLabel.height = gpRetireButton.height;
	gpRetireLabel.font = (cvsize[1]*0.03) + "px 'Lobster' , sursive";
	gpRetireLabel.textAlign = "center";
	gpRetireLabel.color="white";
	gpRetireLabel.addEventListener('enterframe',function(){
		this.visible = GamePause.visible;
		this.opacity = GamePause.opacity;
	});
	
	PlayingScene.addChild(gpRetireLabel);
	PlayingScene.addChild(gpRetireButton);
	
	var LengthGauge = new Sprite(cvsize[0]-14,2);
	LengthGauge.x = 7;
	LengthGauge.y = cvsize[1]-10;
	LengthGauge.backgroundColor = "#fff";
	LengthGauge.addEventListener('enterframe',function(){
		if(rvs == 0){
			this.y = cvsize[1]-10;
		}else{
			this.y = 10;
		}
	});
	
	var LengthNow = new Sprite(10,10);
	LengthNow.x = 2;
	LengthNow.y = LengthGauge.y -5;
	LengthNow.backgroundColor = "#fff";
	LengthNow.addEventListener('enterframe',function(){
		LengthNow.y = LengthGauge.y - 5;
		if(StartWait>0){
			LengthNow.x = 2;
		}else{
			LengthNow.x = (cvsize[0]-12)*(game.assets["mp3/"+MusicFile[SelectNum][SelectMusic[SelectNum][dfn]]].currentTime/game.assets["mp3/"+MusicFile[SelectNum][SelectMusic[SelectNum][dfn]]].duration);
		}
	});
	
	var ViewMusicName = new Label();
	ViewMusicName.width = cvsize[0];
	ViewMusicName.x = 0;
	ViewMusicName.y = cvsize[1]*0.35;
	ViewMusicName.textAlign = "center";
	ViewMusicName.color = "#fff";
	ViewMusicName.font = "80px 'Rounded Mplus 1c'";
	ViewMusicName.addEventListener('enterframe',function(){
		this.text = ViewMusic[SelectNum][dfn];
		if(StartWait > 50){
			this.opacity = 1;
		}else if(StartWait > 40){
			this.opacity = (StartWait-40)*0.1;
		}else{
			this.opacity = 0;
		}
	});
	
	PlayingScene.addChild(ViewMusicName);
	PlayingScene.addChild(LengthGauge);
	PlayingScene.addChild(LengthNow);
	
	PlayingScene.addEventListener('enter',function(){
		setaw = [0,0,0,0,0,0,0];
		setlg = [0,0,0,0,0,0,0];
		srk[StageNum]=0;
		MoveAdd = StartBPM[SelectNum][dfn];
		MoveSpeed = 1;
		ArrowMove = (-200)*(frameMove*(MoveAdd/100) * MoveSpeed)
		bpmcnt = 0;
		spdcng = 0;
		StartWait = 200;
		PrevFrame = -200;
		EndWait = 0;
	});
	
	var EndWait=0;
	PlayingScene.addEventListener('enterframe',function(){
		if(StartWait>0){
			if(!gameps)StartWait--;
			MusicFrame = 0-StartWait;
			if(StartWait==0 && !gameps){
				game.assets["mp3/"+MusicFile[SelectNum][SelectMusic[SelectNum][dfn]]].currentTime = 0;
				game.assets["mp3/"+MusicFile[SelectNum][SelectMusic[SelectNum][dfn]]].play();
			}
		}else{
			if(gameOver){
				if(EndWait==0){
					game.assets["mp3/"+MusicFile[SelectNum][SelectMusic[SelectNum][dfn]]].stop();
				}
				EndWait++;
			}else{
				MusicFrame = Math.round(game.assets["mp3/"+MusicFile[SelectNum][SelectMusic[SelectNum][dfn]]].currentTime*game.fps);
			}
		}
		for(;PrevFrame < MusicFrame;PrevFrame++){
			if(!gameOver)ArrowMove += frameMove*(MoveAdd/100) * MoveSpeed;
			if(PrevFrame >0 ){
				if(chbpm[bpmcnt][0]-1 == PrevFrame){
					MoveAdd = chbpm[bpmcnt][1];
					bpmcnt++;
				}
				if(chhsp[spdcng][0]-1 == PrevFrame){
					MoveSpeed = chhsp[spdcng][1];
					spdcng++;
				}
			}
			for(var i = 0;i<KeyNum[SelectNum][dfn];i++){
				if(setaw[i] < notmx[i]){
					if(arrowSprites[chkaw[i][setaw[i]]].dyp - ArrowMove <= cvsize[1]*4){
						if(arrowSprites[chkaw[i][setaw[i]]].larw > 0){
							this.addChild(longsSprites[chklg[i][setlg[i]]]);
							this.insertBefore(longsSprites[chklg[i][setlg[i]]],keysSprites[0]);
							this.addChild(arrowSprites[chkaw[i][setaw[i]]]);
							this.insertBefore(arrowSprites[chkaw[i][setaw[i]]],keysSprites[0]);
							setaw[i]++;
							this.addChild(arrowSprites[chkaw[i][setaw[i]]]);
							this.insertBefore(arrowSprites[chkaw[i][setaw[i]]],keysSprites[0]);
							setaw[i]++;
							setlg[i]++;
						}else{
							this.addChild(arrowSprites[chkaw[i][setaw[i]]]);
							this.insertBefore(arrowSprites[chkaw[i][setaw[i]]],keysSprites[0]);
							setaw[i]++;
						}
					}
				}
			}
		}
		if((StartWait <= 0 && game.assets["mp3/"+MusicFile[SelectNum][SelectMusic[SelectNum][dfn]]].currentTime >= game.assets["mp3/"+MusicFile[SelectNum][SelectMusic[SelectNum][dfn]]].duration && JudgeSprite.count <= 0 || EndWait >=180) || gpRetry){
			for(var i = 0;i<KeyNum[SelectNum][dfn];i++){
				arrowChecks[i].endcheck();
				PlayingScene.removeChild(arrowChecks[i]);
				PlayingScene.removeChild(keysSprites[i]);
			}
			for(var i = 0;i<noteNum;i++){
				if(arrowSprites[i].chk !== undefined){
					this.removeChild(arrowSprites[i]);
					arrowSprites[i]=0;
				}
			}
			
			for(var i = 0;i<longCnt;i++){
				if(longsSprites[i].chk !== undefined){
					this.removeChild(longsSprites[i]);
					longsSprites[i]=0;
				}
			}
			
			var ktmp = KeyNum[SelectNum][dfn] == 5 ? 0 : 1;
			game.keyunbind(keycodes[ktmp][0]);
			game.keyunbind(keycodes[ktmp][1]);
			game.keyunbind(keycodes[ktmp][2]);
			game.keyunbind(keycodes[ktmp][3]);
			game.keyunbind(keycodes[ktmp][4]);
			if(ktmp==1)game.keyunbind(keycodes[ktmp][5]);
			if(ktmp==1)game.keyunbind(keycodes[ktmp][6]);
			game.keyunbind(keyopt[0],'d');
			game.keyunbind(keyopt[1],'u');
			game.keyunbind(keyopt[2],'g');
			psc = Math.floor(msc * ((jdn[0]*10+jdn[1]*5+jdn[2]*1)/(noteNum*10)));
			if(ngg>=mgg*cgg[gmd] && ExtraMusic[SelectNum] > 0){
				if(exclear < ExtraMusic[SelectNum] || isNaN(exclear)){
					exclear = ExtraMusic[SelectNum];
					localStorage.setItem('exclr', ExtraMusic[SelectNum]);
				}
			}
			gameps=false;
			game.popScene();
			if(gpRetry){
				game.pushScene(LoadingScene);
				gpRetry=false;
			}else{
				game.pushScene(ResultScene);
			}
		}
		
		
	});



	// リザルト画面
	var rsLabel = new Label();
	rsLabel.width = cvsize[0]*0.5;
	rsLabel.height = cvsize[1]*0.1;
	rsLabel.x = cvsize[0]*0.01;
	rsLabel.y = cvsize[1]*0.01;
	rsLabel.color = "#fff";
	rsLabel.font  = (cvsize[0]/20)+"px 'Lobster' , sursive";
	rsLabel.align = "left";
	rsLabel.addEventListener('enterframe',function(){
		if(autoplay){
			this.text = "AutoPlay Complete."
		}else if(ngg>=mgg*cgg[gmd]){
			this.text = "Stage Cleared!";
		}else if(cgg[gmd] == 0){
			this.text = "Stage Breaked...";
		}else{
			this.text = "Stage Failed...";
		}
	});
	ResultScene.addChild(rsLabel);
	
	var rsUnder = new Sprite(cvsize[0]*0.4,2);
	rsUnder.x = 0;
	rsUnder.y = rsLabel.y+rsLabel.height;
	rsUnder.backgroundColor = "rgba(255,255,255,1)";
	ResultScene.addChild(rsUnder);
	
	var JudgeResult = Class.create(Label,{
		initialize:	function(num){
			Label.call(this);
			this.width = cvsize[0]*0.4;
			this.x = cvsize[0]*0.2;
			this.y = cvsize[1]*(0.3 + (num*0.1));
			this.jnum = num;

			this.font = (cvsize[0]/25)+"px 'ＭＳ Ｐゴシック', 'MS PGothic', 'MS Pｺﾞｼｯｸ', 'MS Pゴシック', ＭＳＰゴシック, MSPゴシック, IPAMonaPGothic, 'IPA モナー Pゴシック', 'IPA mona PGothic', 'IPA MONAPGOTHIC',Mona,Monapo, Saitamaar, sans-serif";
			this.textAlign = "left";
			this.align = "left";
		},
		onenterframe:	function(){
			if(this.jnum==0&&autoplay){
				this.color = jdgcl[5];
				this.text = jdgst2[5]+" : " + jdn[5];
			}else{
				this.color = jdgcl[this.jnum];
				this.text = jdgst2[this.jnum]+" : " + jdn[this.jnum];
			}
		}
	});
	var JudgeLabels = new Array();
	for (var i = 0;i<5;i++){
		JudgeLabels[i] = new JudgeResult(i);
		ResultScene.addChild(JudgeLabels[i]);
	}
	
	var scResult = new Label();
	scResult.x = cvsize[0]*0.5;
	scResult.y = JudgeLabels[4].y;
	scResult.width = cvsize[0]*0.4;
	scResult.color = "#FFFFFF";
	scResult.font = (cvsize[0]/25)+"px 'Lobster' , sursive";
	scResult.textAlign = "left";
	scResult.align = "left";
	scResult.addEventListener('enterframe',function(){
		this.text = "Score : " + psc;
	});
	ResultScene.addChild(scResult);
	
	var mcResult = new Label();
	mcResult.x = cvsize[0]*0.5;
	mcResult.y = JudgeLabels[3].y;
	mcResult.width = cvsize[0]*0.4;
	mcResult.color = "#FFFFFF";
	mcResult.font = (cvsize[0]/25)+"px 'Lobster' , sursive";
	mcResult.textAlign = "left";
	mcResult.align = "left";
	mcResult.addEventListener('enterframe',function(){
		this.text = "MaxCombo : " + mcb;
	});
	ResultScene.addChild(mcResult);
	
	var rkLabel = new Label();
	rkLabel.width = cvsize[0]*0.35;
	rkLabel.x = cvsize[0]*0.553;
	rkLabel.y = cvsize[1]*0.153;
	rkLabel.color = "#FFFFFF";
	rkLabel.font = (cvsize[0]/5) + "px 'Lobster' , sursive";
	rkLabel.textAlign = "center";
	rkLabel.align = "center";
	rkLabel.addEventListener('enterframe',function(){
		this.text = rtLabel.text;
	});
	ResultScene.addChild(rkLabel);
	
	var rtLabel = new Label();
	rtLabel.width = cvsize[0]*0.35
	rtLabel.x = cvsize[0]*0.55;
	rtLabel.y = cvsize[1]*0.15;
	rtLabel.font = (cvsize[0]/5) + "px 'Lobster' , sursive";
	rtLabel.textAlign = "center";
	rtLabel.align = "center";
	rtLabel.addEventListener('enterframe',function(){
		if(srk[StageNum]==0){
			var i = 0;
			for(;i<brk.length;i++){
				if(psc >= msc * brk[i]){
					break;
				}
			}
			srk[StageNum]=i+1;
			this.text = lrk[i];
			this.color = crk[i];
		}
	});
	ResultScene.addChild(rtLabel);

	var bcButton = new Sprite(onwide,arsize);
	bcButton.image = SpaceSurface;
	bcButton.x = cvsize[0]*0.98 - onwide;
	bcButton.y = cvsize[1]*0.98 - arsize;
	bcButton.addEventListener('touchend',function(){
		game.popScene();
		game.pushScene(TitleScene);
	});
	ResultScene.addChild(bcButton);
	
	var twSprite = new Sprite(400,400);
	twSprite.image = game.assets["twiticon.png"];
	twSprite.scaleX = 0.2;
	twSprite.scaleY = 0.2;
	twSprite.x = 5;
	twSprite.y = cvsize[1]*0.98-(twSprite.height);
	twSprite.addEventListener("touchend",function(){
		var resStrs = ngg >= mgg*cgg[gmd] ? "Clear" : "Failed";
		var urlstr = "";
		if(autoplay){
			urlstr = "【ダンおにプレゼンター】"+MusicName[SelectNum]+"("+DiffName[SelectNum][dfn]+")/"+NotesCreator[SelectNum][dfn]+"/Arrow("+jdn[5]+") "+location.href+" #danoni";
		}else{
			urlstr = "【ダンおにったー】"+MusicName[SelectNum]+"("+DiffName[SelectNum][dfn]+")/"+NotesCreator[SelectNum][dfn]+"/"+lrk[srk[StageNum]-1]+"("+gst[gmd]+":"+resStrs+")/"+jdn[0]+"-"+jdn[1]+"-"+jdn[2]+"-"+jdn[3]+"-"+jdn[4]+"/Mc"+mcb+"/Sc"+psc+" "+location.href+" #danoni";
		}
		window.open("https://twitter.com/?status="+encodeURIComponent(urlstr));
	});
	ResultScene.addChild(twSprite);
	
	// ゲーム開始
	game.pushScene(BaseScene);
	
	};
	game.start();
};

// I'm Dreamer.
function randomCheck(KeyNums,arnd){
	var nonrandom;
	var templine = [0,1,2,3,4,5,6];
	var tempflag = [false,false,false,false,false,false,false];
	var rntmp;
	if(!arnd){
		if(KeyNums==5){
			nonrandom = 4;
			tempflag[4] = true;
		}else if(KeyNum==7){
			nonrandom = 3;
			tempflag[3] = true;
		}
	}
	for(var rd = 0;rd<KeyNums;rd++){
		if(nonrandom != rd){
			do{
				rntmp = Math.floor(Math.Random() * KeyNums);
			}while(tempflag[rntmp]);
			tempflag[rntmp] =true;
			templine[rntmp] = rd;
		}
	}
	return templine;
}