//블랙잭 전역변수들
let BJ_gameon = false; //Game starting checker
let BJ_players = new BJ_player[];  //Game players
let BJ_player= {
  deck : [],
  name : "",
  hit : false
};
let BJ_gamestart = false;   //When game is playing , it turned to true
let BJ_continue = false;  //one more game?
let BJ_dealer = {
  deck : [],
  name : "dealer",
  hit : false
};
let BJ_ishit = false; //hitting phase?
let BJ_cardset = new Array(52); //카드덱은 한개로 진행, 중복체크용

//카드 합 계산 함수 - 버스트시 -1 반환 블랙잭시 0 반환
function cardsum(player) {
  var sum;
  var tmp_deck = player.deck.map(el => el%12);
  tmp_deck.sort( (a,b) => b-a);

  for(var i=0; i<tmp_deck.length; i++) {

    if(sum<11 && tmp_deck[i] == 1)
    sum += 11;





  }
  return sum;

}

//카드를 중복되지 않게 나눠줌
function bjcardtoss(player) {
  while(1) {
    var random = Math.floor(Math.random() * 51) + 1;
    if (!BJ_cardset[random])
    {
      player.deck.push(random);
      BJ_cardset[random] = 1;
      break;
    }
  }
}

function bjcardshow(player) {
  replier.reply(player.name + "님의 카드\n");
  for(var i=0; i<player.deck.length; i++) {
    switch (player.deck[i] / 12) {
      case 0:
      replier.reply("♠ " + (player.deck[i] % 12 + ' '));
      case 1:
      replier.reply("◆ " + (player.deck[i] % 12 + ' '));
      case 2:
      replier.reply("♥ " + (player.deck[i] % 12 + ' '));
      case 3:
      replier.reply("♣ " + (player.deck[i] % 12 + ' '));
    }
  }
  replier.reply("\n");
}


 else if (cmd == "!블랙잭"){
       if (BJ_gameon == false && data =="시작"){
           Thread_BJ = java.lang.Thread();
           BJ_gameon = true;
           BJ_cardset = [0, ];
           var count = 0;
           replier.reply(sender+"님 주최하에 블랙잭 게임을 시작하겠습니다.");
           BJ_players.add(sender);
           while (count < 4 ){
             replier.reply("플레이어를 기다리겠습니다. 경과 시간: "+10*Number(count)+"초");
             Thread_BJ.sleep(10000);
             count ++;
           }
           else{
               replier.reply("블랙잭 게임을 시작합니다. \n 참가한 사람 목록 : ");
               BJ_gamestart = true;
               for (var i=0; i<BJ_players.length; i++) {
                  replier.reply(BJ_players[i].name+" ");
               }
               //딜러 처음 두장
               bjcardtoss(BJ_dealer);
               bjcardtoss(BJ_dealer);

               //유저들 처음 두장
               for (var i=0; i<BJ_players.length; i++) {
                   bjcardtoss(BJ_players[i]);
                   bjcardtoss(BJ_players[i]);
               }

               //카드 오픈
               bjcardshow(BJ_dealer);
               for(var i=0; i<BJ_players.length; i++) {
                 bjcardshow(BJ_players[i]);
               }



               //초기화
               BJ_gameon = false;
               BJ_gamestart = false;
               BJ_players.clear();
           }

       }
       else if(BJ_gameon == true && data == "참가" && BJ_gamestart == false){
           BJ_players.push = {
             deck : [],
             name : sender,
           };
           replier.reply(sender+"님 성공적으로 게임참여 완료");

       }

       else{
           replier.reply("현재 게임에 참여할 수 없는 상태입니다.");
       }


   }
