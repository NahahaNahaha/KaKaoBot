function blackjack()
{
//초성게임 전역변수들
let BJ_gameon = false; //Game starting checker
let BJ_players = new BJ_player[];  //Game players
let BJ_player= new {
  deck : [],
  name : ""
};
let BJ_gamestart = false;   //When game is playing , it turned to true
let BJ_cardset = new Array(52);
let BJ_continue = false;
let BJ_dealedeck = new Array();

function cardsum(deck) {


}

 else if (cmd == "!블랙잭"){
       if (BJ_gameon == false && data =="시작"){
           Thread_BJ = java.lang.Thread();
           BJ_gameon = true;
           carSet = [0,];
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
               for (var i=0; i<BJ_players.size;i++) {
                  replier.reply(BJ_players[i].name+" ");
               }
               do {
                 //딜러 처음 두장
                   var random = Math.floor(Math.random() * 52);
                   if (BJ_cardset(random)==0)
                   {
                     BJ_dealerdeck.push(BJ_cardset(random));
                   }
               }
               while (BJ_dealerdeck[0]==BJ_dealerdeck[1]);

               for (var i=0; i<BJ_players.size; i++) {
                 do {
                   //유저들 처음 두장
                     var random = Math.floor(Math.random() * 52);
                     if(BJ_cardset(random)==0)
                     {
                       BJ_players.deck.push(random);
                     }
                 }
                 while(BJ_dealerdeck[0]==BJ_dealerdeck[1]);
               }

               while(BJ_continue)
               //초기화
               BJ_gameon = false;
               BJ_gamestart = false;
               BJ_players.clear();
               BJ_players_list = [];
           }

       }
       else if(BJ_gameon == true && data == "참가" && BJ_gamestart == false){
           BJ_players.add(sender);
           replier.reply(sender+"님 성공적으로 게임참여 완료");

       }

       else{
           replier.reply("현재 게임에 참여할 수 없는 상태입니다.");
       }


   }



 }
}
