window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1);
        };
})();


var canvas = document.querySelector('#canvas-container');
var ctx = canvas.getContext('2d');

var timerID;
var density = 150;  //パーティクルの密度
var particles = []; //パーティクルをまとめる配列
var colors = ['#D0A000', '#6DD0A5', '#E084C5'];

var Particle = function(scale, color, vx, vy, gv) {
    this.scale = scale; //大きさ
    this.color = color; //色
    this.vx = vx; //X速度
    this.vy = vy; //Y速度
    this.gv = gv; //重力
    this.position = {   // 位置
        x: 0,
        y: 0
    };
};

Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.scale, 0, 2*Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
};

Particle.prototype.update = function() {
    this.vy += this.gv;
    this.position.x += this.vx;
    this.position.y += this.vy;
    this.draw();
};

function createCanpas(){
    $('#canvas-container').show();
}

function removeCanpas(){
    $('#canvas-container').hide();
}

function resetPosition(){    
    for (var i=0; i<density; i++) {
        var color = colors[~~(Math.random()*3)];
        var scale = ~~(Math.random()*5)+3;
        var x = Math.random() * 10 - 5;
        var y = Math.random()* 9 + 4;
        var g = Math.random()* 0.2 + 0.3;
        
        particles[i] = new Particle(scale, color, x, -y, g);
        particles[i].position.x = canvas.width / 2;
        particles[i].position.y = 200;
        
    }
}

function loop() {
    timerID = requestAnimFrame(loop);
    // 描画をクリアー
    ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
    for (var i in particles) {
        particles[i].update();
    }
}







/* スライドおよびデータ取得処理 */ 


var count=0;
var tweet_num=-2;
var latest_num = null;

function pressed(){
    count ++;
    boyon();
    if(count >= 5){
        start();
        count=0;
    }
}

function passed(){
    move(tweet_num,tweet_num+1,tweet_num+2);
    tweet_num ++;
    count=0;
}

function boyon(){
    $(".main > div.tweet-text ").animate( { opacity:0 }, { queue:false, duration:0 } );
    $(".main > div.tweet-text ").animate( { opacity:0 }, { duration:300 } );
    $(".main > div.tweet-text ").animate( { opacity:1 }, { duration:100 } );

    $(".main").animate( { width:"85%" }, { duration:80 } );
    $(".main").animate( { width:"95%" }, { duration:80 } );
    $(".main").animate( { width:"90%" }, { duration:80 } );

    setTimeout(function(){

    }, 400);
}

function start(){
    createCanpas();
    cancelAnimationFrame(timerID);
    resetPosition();
    loop();
    move(tweet_num);
    tweet_num ++;
}

function move(num){
    before=num;
    main=num+1;
    after=num+2;
    more=num+3;
    more_more=num+4;

    createNewTweet($("#tweet_"+before), more_more);
    
    $("#tweet_"+main).css("z-index", "1");
    $("#tweet_"+main).animate( { marginTop:"400px", width: "70%", opacity: "0.3" }, { duration:300 } );
    $("#tweet_"+main).removeClass('main');

    $("#tweet_"+after).css("z-index", "10");
    $("#tweet_"+after).animate( { marginTop:"200px", width: "90%", opacity: "1" }, { duration:300 } );
    $("#tweet_"+after).addClass('main');

    $("#tweet_"+more).animate( { opacity:"0.3" }, { duration:100 } );

}

function createNewTweet($before, after_id){
    if($before != null){
        $before.attr("id", "tweet_" + after_id);
    }

    $("#tweet_"+after_id).animate( { marginTop:"0px", width: "70%", opacity: 0 }, { duration:0 } );
}


function setTweetDataToDom($div, json){
    //dataをDOMにつける

    //画像
    //ユーザ名
    //screen名
    //テキスト
    //日付

}

function doError(){

}

function getTweetDataFromServer($div, number){
    return;
    //latest_numberを使ってajaxでデータ取得する
    $.ajax({
       type: "POST",
       url: "http://wakuwakupark.xsrv.jp/application/happycollection/getTweet",
       data: {
            "latest_number": latest_number,
       },
       dataType: 'json',
       success: function(json){
            setTweetDataToDom($div, json);
            latest_num = number;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown){
            doError();
       }
    });
}


function init(){

    //canpas設定
    height = $(window).width();
    width = $(window).height()/2;
    $('#canvas-container').attr({
        'height': height,
        'width': width
    });

    //初期データのロード
    getTweetDataFromServer($('#tweet_0'), latest_num);
    getTweetDataFromServer($('#tweet_1'), latest_num);
    getTweetDataFromServer($('#tweet_2'), latest_num);
    getTweetDataFromServer($('#tweet_3'), latest_num);

    //ユーザ0が取得できるまで待機
    //ダメだったらタイムアウト

    move(tweet_num);
    tweet_num ++;
}

init();
