//블랙잭 전역변수들
let BJ_gameon = false; //Game starting checker
let BJ_players = new BJ_player[];  //Game players
let BJ_player= {
  deck : [],
  decksum : 0,
  name : "",
  hit : false,
  burst : false
};
let BJ_gamestart = false;   //When game is playing , it turned to true
let BJ_continue = false;  //one more game?
let BJ_dealer = {
  deck : [],
  decksum : 0,
  name : "dealer",
  hit : false,
  burst : false,
};
let BJ_ishitting = false; //hitting phase?
let BJ_cardset = new Array(52); //카드덱은 한개로 진행, 중복체크용

//카드 합 계산 함수 - 버스트시 -1 반환 블랙잭시 22 반환
function bjcardsum(player) {
  var sum;
  var tmp_deck = player.deck.map(el => el%13); //전부 1~13 으로 치환
  tmp_deck.sort((a,b) => b-a); //내림차순 정렬

  for(var i=0; i<tmp_deck.length; i++) { //11~13은 전부 10으로 계산
    if(tmp_deck[i] > 10)
      tmp_deck[i] = 10;
  }

  for(var i=0; i<tmp_deck.length; i++) {

    if(sum < 11 && tmp_deck[i] == 1) //A일 경우
    sum += 11;
    else if(sum >= 11 && tmp_deck[i] == 1)
    sum += 1;
    else if(sum <= 20) //그 외 나머지 숫자들 계산
    sum += tmp_deck[i];
    else if(sum == 10 && tmp_deck[i] == 1)
      return 22; //블랙잭!
    else if(sum > 21)
      {
        player.burst = true;
        return -1; //버스트
      }
  }
  player.decksum = sum;
  return sum; //합을 반환

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

function bjcardfirstshow(player) {
  replier.reply("딜러의 카드\n");
  switch (player.deck[0]-1 / 13) {
    case 0: {
      if(player.deck[0] <= 10)
        replier.reply("♠" + (player.deck[0] % 13 + ' '));
      else if(player.deck[0] == 11)
        replier.reply("♠J ");
      else if(player.deck[0] == 12)
        replier.reply("♠Q ");
      else if(player.deck[0] == 0)
        replier.reply("♠K ");
    }
    case 1: {
    if(player.deck[0] <= 10)
      replier.reply("◆" + (player.deck[0] % 13 + ' '));
    else if(player.deck[0] == 11)
      replier.reply("◆J ");
    else if(player.deck[0] == 12)
      replier.reply("◆Q ");
    else if(player.deck[0] == 0)
      replier.reply("◆K ");
    }
    case 2: {
    if(player.deck[0] <= 10)
      replier.reply("♥" + (player.deck[0] % 13 + ' '));
    else if(player.deck[0] == 11)
      replier.reply("♥J ");
    else if(player.deck[0] == 12)
      replier.reply("♥Q ");
    else if(player.deck[0] == 0)
      replier.reply("♥K ");
    }
    case 3: {
    if(player.deck[0] <= 10)
      replier.reply("♣" + (player.deck[0] % 13 + ' '));
    else if(player.deck[0] == 11)
      replier.reply("♣J ");
    else if(player.deck[0] == 12)
      replier.reply("♣Q ");
    else if(player.deck[0] == 0)
      replier.reply("♣K ");
    }
  }
}

function bjcardshow(player) { //손 패 공개
  replier.reply(player.name + "님의 카드\n");
  for(var i=0; i<player.deck.length; i++) {
    switch (player.deck[i]-1 / 13) {
      case 0: {
        if(player.deck[i]%13 == 0)
          replier.reply("♠K ");
        else if(player.deck[i]%13 == 11)
          replier.reply("♠J ");
        else if(player.deck[i]%13 == 12)
          replier.reply("♠Q ");
        else if(player.deck[i]%13 <= 10)
          replier.reply("♠" + (player.deck[i] % 13 + ' '));
      }
      case 1: {
        if(player.deck[i]%13 == 0)
          replier.reply("◆K ");
        else if(player.deck[i]%13 == 11)
          replier.reply("◆J ");
        else if(player.deck[i]%13 == 12)
          replier.reply("◆Q ");
        else if(player.deck[i]%13 <= 10)
          replier.reply("◆" + (player.deck[i] % 13 + ' '));
      }
      case 2: {
        if(player.deck[i]%13 == 0)
          replier.reply("♥K ");
        else if(player.deck[i]%13 == 11)
          replier.reply("♥J ");
        else if(player.deck[i]%13 == 12)
          replier.reply("♥Q ");
        else if(player.deck[i]%13 <= 10)
          replier.reply("♥" + (player.deck[i] % 13 + ' '));
      }
      case 3: {
        if(player.deck[i]%13 == 0)
          replier.reply("♣K ");
        else if(player.deck[i]%13 == 11)
          replier.reply("♣J ");
        else if(player.deck[i]%13 == 12)
          replier.reply("♣Q ");
        else if(player.deck[i]%13 <= 10)
          replier.reply("♣" + (player.deck[i] % 13 + ' '));
      }
    }
  }
  replier.reply("\n");

}

function bjhitting(player) {
  if(player.hit)
  {
    bjcardtoss(player);
    bjcardshow(player);
    bjcardsum(player);
    if(player.decksum < 21 && player.decksum > 1)
    replier.reply(player.name + "님의 카드 합:" + player.decksum);
    else if(player.decksum == -1)
    replier.reply(player.name + "님 버스트입니다.");
    else if(player.decksum == 22)
    replier.reply("♠" + player.name + "님의 블랙잭♠");
  }
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

               //카드 오픈 & 초기 패 계산
               bjcardfirstshow(BJ_dealer);
               for(var i=0; i<BJ_players.length; i++) {
                 bjcardshow(BJ_players[i]);
               }

               for(var i=0; i<BJ_players.length; i++) {
                 BJ_players[i].decksum = bjcardsum(BJ_players[i]);
                 if(BJ_players[i].decksum == 22)
                  replier.reply(BJ_players[i].name + "님의 블랙잭!");
               }

               //게임 시작!

               while(1) {
                 replier.reply("Stay or Hit? Hit 하시려면 \"!히트\"를 입력해주세요.");
                 BJ_ishitting = true;
                 replier.reply("10초 기다리겠습니다.");
                 Thread_BJ.sleep(10000);
                 BJ_ishitting = false;
                 var check;
                 for(var i=0; i<BJ_players.length; i++) {
                   if(BJ_players[i].hit)
                    check++;
                 }

                 if(check==0) //모두 스테이 혹은 버스트일 경우 계산 페이즈로
                  break;

                 for(var i=0; i<BJ_players.length; i++) {
                   if(!BJ_players[i].hit)
                   replier.reply(BJ_players[i].name + "님 스테이.");
                 }

                 for(var i=0; i<BJ_players.length; i++) {
                   bjhitting(BJ_players[i]);
                   BJ_players[i].hit = false;
                 }
               }

               replier.reply("딜러의 턴을 시작하겠습니다.");
               bjcardshow(BJ_dealer);
               bjcardsum(BJ_dealer);

               while(BJ_dealer.decksum <= 16) { //16이하일 경우는 항상 히트
                   bjhitting(BJ_dealer);
               }
               var winplayer = [];
               var drawplayer = [];
               var loseplayer = [];
               for(var i=0; i<BJ_players.length; i++) { //승패결정
                 if(BJ_players[i].decksum > BJ_dealer.decksum)
                 winplayer.push(BJ_players[i].name);
                 else if(BJ_players[i].decksum == BJ_dealer.decksum)
                 drawplayer.push(BJ_players[i].name);
                 else
                 loseplayer.push(BJ_players[i].name);
               }

               replier.reply("승리한 플레이어 : " + winplayer + "\n비긴 플레이어 : " + drawplayer + "\n진 플레이어 : " + loseplayer);

               //초기화
               BJ_gameon = false;
               BJ_gamestart = false;
               BJ_players = [];
               BJ_dealer = {
                 deck : [],
                 decksum : 0,
                 name : "dealer",
                 hit : false,
                 burst : false,
               };
           }

       }
       else if(BJ_gameon == true && data == "참가" && BJ_gamestart == false){
           BJ_players.push = {
             deck : [],
             decksum : 0,
             name : sender,
             hit : false,
             burst : false
           };
           replier.reply(sender+"님 성공적으로 게임참여 완료");
       }

       else if(BJ_gameon == true && data == "히트" && BJ_ishitting == true) {
         for(var i =0; i<BJ_players.length; i++) {
           if(sender == BJ_players[i].name) {
             if(BJ_players[i].burst) {
               replier.reply(BJ_players[i].name + "님은 버스트 하셨습니다.");
             }
             else {
               BJ_players[i].hit = true;
               replier.reply(sender + "님 히트");
               break;
             }
           }
         }
       }

       else{
           replier.reply("현재 게임에 참여할 수 없는 상태입니다.");
       }


   }
