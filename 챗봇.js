//오늘 날씨 알려주는 함수
function getWeatherInfo(area){
try{
    var data = Utils.getWebText("https://m.search.naver.com/search.naver?sm=mtp_hty.top&where=m&query="+area+"날씨");
    data=data.replace(/<[^>]+>/g,"");
    data=data.split("월간")[1];
    data=data.split("시간별 예보")[0];
    data=data.trim();
    data=data.split("\n");

    var results = [];
    results[0] = "현재 상태는 "+data[0].trim()+"이고";
    results[1] = data[3].replace("온도","온도:").trim()+"°C";
    results[2] = data[4].replace("온도","온도:").trim()+"°C"; 
    results[3] = data[9].replace("먼지","먼지:").trim(); 
    
    dust = Number(data[9].replace("㎍/㎥","").replace("미세먼지","").trim()); 
    
    if (dust<=15){
        results[4]= "미세먼지 농도는 좋음입니다."
    }
    
    else if(dust<=35){
        results[4]= "미세먼지 농도는 보통입니다."
    } 
    
    else if(dust<=75){
        results[4]= "미세먼지 농도는 나쁨입니다."
    }
    
    else{
        results[4]= "미세먼지 농도는 매우 나쁨입니다.\n 마스크 꼭 챙기세요~!"
    }

    results[5] = data[13].replace("습도","습도:").trim()+"%"; 

    var Weather = "["+area+" 날씨 정보]\n\n"+results.join("\n");
    return Weather; 
    }catch(e){
    return null;
    }
}

//내일 날씨 알려주는 함수
function getTomorrow(area){
    try{ 
        var data = Utils.getWebText("https://m.search.naver.com/search.naver?sm=mtp_hty.top&where=m&query="+area+"날씨"); 
        data=data.replace(/<[^>]+>/g,""); 
        data=data.split("시간별 예보")[1];
        data=data.split("시간별 예보")[0]; 
        data.trim();   
        data=data.split("\n");

        var results = []; 
        
        results[0] = data[337].trim();                                          //오전 
        results[1] = data[340].trim();                                          //오전 상태 
        results[2] = data[346].trim().replace("미세먼지","미세먼지: ");          //오전 미세먼지 
        results[3] = data[347].trim().replace("강수확률","강수확률: ")+"%"+"\n"; //오전강수확률 
        
        results[4] = data[351].trim();                                               //오후 
        results[5] = data[354].trim();                                               //오후 상태
        results[6] = data[360].trim().replace("미세먼지","미세먼지: ");               //오후 미세먼지 
        results[7] = data[361].trim().replace("강수확률","강수확률: ")+"%"+"\n";      //오후 강수확률   

        var result = "[내일 "+area+" 날씨 정보]\n\n"+results.join("\n"); 

       return result;

    }catch(e){
        return null;
    }


} 

//단어 검색 함수
function dictionary(word){
    
    try{
    var html = Utils.getWebText("https://stdict.korean.go.kr/search/searchResult.do?pageSize=10&searchKeyword="+word); 
    html=html.replace(/<[^>]+>/g,""); 
    html=html.split("선택 항목")[1];
    html=html.split("선택 항목")[0]; 
    html=html.trim();
    html=html.split("취소")[1]; 
    html=html.trim(); 
    html=html.split("\n");
   
    for(var i=0;i<html.length;i++){
        html[i]=html[i].trim();
    }

    html = html.join("\n"); 
    html = html.replace(/전체 보기/gi,"");
    
    html=html.substring(0,html.length-8);

    return html;

    } 
    catch(e){
        return null;
    }
    
} 


//결정봇
function determinBot(set){
    try{
      var list = set.split(' ');
      var saying = [" 어때요?", " 좋아보이는데요?", " 무르기는 없어요.", " 이건 의외인가요?"];
      var result = list[Math.floor(Math.random() * list.length)] + saying[Math.floor(Math.random() * saying.length)];
      return result;
    } 

    catch(e){
        return null;
    }
  
  
  }

//알람 함수
function alarm(alarm_data){
    try{
        var date = new Date();
        var call_date = new Date();
        var hour_data = alarm_data.split(":")[0];
        var minute_data = alarm_data.split(":")[1];
        var hour = Number(hour_data);
        var min  = Number(minute_data);
        call_date.setHours(hour);
        call_date.setMinutes(min);
        var date_difference = call_date.getTime() -  date.getTime(); 
         
        if(date_difference<= 0 ){
            return null;
        }
        else{
            
            return date_difference;

        }


    }
    catch(e){
        return null;
    }


}

//초성게임 전역변수들
let CH_gameon = false; //Game starting checker 
let CH_players = new Set();  //Game players
let CH_gamestart = false;   //When game is playing , it turned to true
const CH_letter = ["ㄱ","ㄴ","ㄷ","ㄹ","ㅁ","ㅂ","ㅅ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"]; //Hangul 
let CH_turn_player = []; //Turn player 
let CH_game_letter = [];  //Game letter 
let CH_flag = false;  //if player plays right input for word, it changed to true value
let CH_word_history = new Set();
let turn =0;   //searching for turn player
let CH_outFlag = false;

//CHo Sung Game function
function CH_right_letter(data){
    var jaeum = [ 'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ];
    var right_word = true; 
    for(var i=0; i<2; i++) {
      var index_test = Math.floor(((data.charCodeAt(i) - 44032) /28) / 21);
      if(jaeum[index_test] != CH_game_letter[i]) {
        right_word = false;
        break; 
      } 
    } 
    return right_word;
}

//블랙잭 전역변수들
let BJ_gameon = false; //Game starting checker
let BJ_players = new Array();  //Game players
let BJ_player= {
  deck : [],
  decksum : 0,
  name : "",
  hit : false,
  burst : false
};
let BJ_gamestart = false;   //When game is playing , it turned to true

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
    var tmp_deck = player.deck.map(el => el%13 + 1); //전부 1~13 으로 치환
    tmp_deck.sort((a,b) => b-a); //내림차순 정렬


  
    for(var i=0; i<tmp_deck.length; i++) { //11~13은 전부 10으로 계산
      if(tmp_deck[i] > 10)
        tmp_deck[i] = 10;
    }
  
    for(var i=0; i<tmp_deck.length; i++) {
      
      if(sum == 10 && tmp_deck[i] == 1 && player.deck.length == 2)
      player.decksum =  22; //블랙잭!
      else if(sum < 11 && tmp_deck[i] == 1) //A일 경우
      sum += 11;
      else if(sum >= 11 && tmp_deck[i] == 1)
      sum += 1;
      else if(sum <= 20) //그 외 나머지 숫자들 계산
      sum += tmp_deck[i];
      
      else if(sum > 21)
        {
          player.burst = true;
          player.decksum = -1; //버스트
        }
    }
    player.decksum = sum; //합을 반환
  
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







//전체 응답 메인 함수
function response(room, msg, sender, isGroupChat, replier, imageDB)  
{
 msg = msg.trim();  
 var cmd = msg.split(" ")[0];
 var data = msg.replace(cmd + " ","");

 if(cmd =="!날씨"){
    var result = getWeatherInfo(data);
    if(result == null){
        replier.reply(data + "은(는) 적절치 않은 검색어입니다. "+sender+"님");
    }
    else {
        replier.reply(result);
    }
 }


 else if(cmd == "!소환"){
     replier.reply("1. !날씨 {지역명}을 입력하면\n{지역명} 의 날씨를 알려줍니다.\n\n2. !내일 {지역명}을 입력하면\n{지역명}의 내일 날씨를 알려줍니다.\n\n"+
     "3. !사전 {단어}를 입력하면\n{단어}의 정의를 알려줍니다.\n\n4. !룰렛 을 입력하면 1~100 중 랜덤으로 정수 하나를 내놓습니다.\n\n"+
     "5. !결정 {인자1 인자2 인자3 ....} 을 입력하면 이 중 하나를 봇이 결정해서 알려줍니다.(띄어쓰기로 인자 구별)\n\n"+
     "6. !알림 {hour}:{minute}:{원하는 문구} 를 입력하면 당일 그 시각에 원하는 문구로 톡이 갑니다~\n\n"+
     "7. 초성게임관련\n\n 7.1 '!초성게임 시작' 으로 게임시작 가능\n 7.2 '!초성게임 참가'로 게임 참여 가능\n 7.3 !초성 {단어}로 자기 턴에 단어 제출 가능 ");
 }


 else if(cmd == "!내일"){
    var result_2 = getTomorrow(data);
    if(result_2 == null){
        replier.reply(data + "은(는) 적절치 않은 검색어입니다. "+sender+"님");
    }
    else {
        replier.reply(result_2);
    }
 } 
 
 else if(cmd == "!군대"){
     if(data == "학건"){
         replier.reply("얼마 남지 않았습니다ㅋ");
     }
     else if(data == "현모"){
         replier.reply("자랑스러운 전역전사입니다");
     }
     else if(data == "종헌"||data == "하람"||data == "진우"){
         replier.reply("열심히 국방의 의무를 수행중입니다.");
     }
     else{
         replier.reply("ㅎㅎ");
     }
 } 

 else if(cmd == "!사전"){ 
     var result_3 = dictionary(data);
    if(result_3 == null){
        replier.reply(data + "은(는) 적절치 않은 검색어입니다. "+sender+"님");
    }
    else {
        replier.reply(result_3);
    }
 }

 else if(cmd == "!룰렛"){
    var result_4 = Math.floor(Math.random() * 100) + 1; 
    if(result_4 == 1){
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님 너무 한심해요~~~~~~웩~~~~"); 
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님 너무 한심해요~~~~~~웩~~~~");
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님 너무 한심해요~~~~~~웩~~~~");
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님 너무 한심해요~~~~~~웩~~~~");
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님 너무 한심해요~~~~~~웩~~~~");
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님 너무 한심해요~~~~~~웩~~~~");
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님 너무 한심해요~~~~~~웩~~~~");
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님 너무 한심해요~~~~~~웩~~~~");
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님 너무 한심해요~~~~~~웩~~~~");
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님 너무 한심해요~~~~~~웩~~~~");
        
    }
    else if(result_4<=10){
        replier.reply(result_4+"(이)가 나왔습니다...\n"+sender+"님~ 너무 한심하네요~");
    }
    else if(result_4<=50){
        replier.reply(result_4+"(이)가 나왔습니다...\n"+sender+"님 나쁘지는 않네요ㅋ");
    }
    else if(result_4<=80){
        replier.reply(result_4+"(이)가 나왔습니다...\n"+sender+"님 괜찮은데요? ");
    }
    else if(result_4<=90){
        replier.reply(result_4+"(이)가 나왔습니다...\n"+sender+"님 상위권 축하드려요~");
    } 
    else if(result_4<=99){
        replier.reply(result_4+"(이)가 나왔습니다...\n"+sender+"님 최상위권이네요^^!");
    }
    else{
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님이 왕좌에 오르셨습니다.");
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님이 왕좌에 오르셨습니다.");
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님이 왕좌에 오르셨습니다.");
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님이 왕좌에 오르셨습니다.");
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님이 왕좌에 오르셨습니다.");
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님이 왕좌에 오르셨습니다.");
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님이 왕좌에 오르셨습니다.");
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님이 왕좌에 오르셨습니다.");
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님이 왕좌에 오르셨습니다.");
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님이 왕좌에 오르셨습니다.");
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님이 왕좌에 오르셨습니다.");
        replier.reply(result_4+"(이)가 나왔습니다.\n"+sender+"님이 왕좌에 오르셨습니다.");

    }
    
 } 

 else if(cmd == "!주추" && !isGroupChat){
    var result_5 = Utils.getWebText("https://www.avdbs.com/menu/dvd_ranking.php"); 
    result_5=result_5.replace(/<[^>]+>/g,""); 
    result_5=result_5.trim(); 
    result_5 = result_5.split("년간순위")[1];
    result_5 = result_5.split("11위")[0]; 
    result_5=result_5.trim(); 
    result_5=result_5.split("\n");
   
    for(var i=0;i<result_5.length;i++){
        result_5[i]=result_5[i].trim();
    }

    result_5 = result_5.join("\n"); 
    replier.reply(result_5);
 } 

 else if(cmd == "!알림"){
    Thread1 = java.lang.Thread();
    Thread2 = java.lang.Thread();
    var alarm_return = alarm(data); 
    var talk_data = data.split(":")[2];
    if(alarm_return == null||alarm_return == NaN){
        replier.reply("잘못된 입력입니다.");
    }

    else{
        try{
        Thread2.sleep(alarm_return/10000000000);
        replier.reply(sender+"님 알람 설정되었습니다.");
        Thread1.sleep(alarm_return);
        replier.reply(talk_data);
        }
        catch(e){
            replier.reply("잘못된 입력입니다.");
        }
        
    }
    
       
   } 

 else if(cmd == "!테스트"){
   var test_array = new king[];
   let king= {
    deck : [],
    decksum : 0,
    name : "",
    hit : false,
    burst : false
  };  
  replier.reply(test_array);


 } 

 

 else if(cmd == "!결정"){
    var result_determin = determinBot(data);
    if(result_determin == null){
        replier.reply("이런 식으로는 안돼요~");
        }
        else{
            replier.reply(result_determin);
        }
  } 

  else if(cmd == "!초성게임"){
      if(CH_gameon == false && data =="시작"){
          Thread3 = java.lang.Thread(); 
          Thread4 = java.lang.Thread();
          CH_gameon = true; 
          replier.reply(sender+"님 주최하에 초성 게임이 시작했습니다."); 
          CH_players.add(sender);

          replier.reply("플레이어를 30초동안 기다리겠습니다.");  
          Thread3.sleep(30000); 
            
          
          if (CH_players.size < 3){
              replier.reply("참가자가 부족해서 게임대기를 종료합니다.");
              CH_gameon = false;
              CH_players.clear();
          }
          else{
              replier.reply("초성게임을 시작합니다. \n 참가한 사람명: "); 
              CH_gamestart = true;
              let CH_players_list = [v for (v of CH_players)]; 
              for (var i=0; i<CH_players.size;i++){
                  replier.reply(CH_players_list[i]+" ");
              }  
              CH_game_letter[0] = CH_letter[Math.floor(Math.random() * 14)]; 
              CH_game_letter[1] = CH_letter[Math.floor(Math.random() * 14)]; 
              replier.reply("이번 게임 초성은 ["+CH_game_letter[0]+CH_game_letter[1]+"] 입니다.");  
              turn = Math.floor(Math.random() * CH_players.size);
              while(CH_players.size != 1){ 
                if(turn < CH_players.size){
                    CH_turn_player[0] = CH_players_list[turn];
                }
                else{
                    turn = 0;
                    CH_turn_player[0] = CH_players_list[turn];
                }
                replier.reply("This time, "+CH_turn_player[0]+"'s turn!"); 
                replier.reply("15초동안 플레이어의 입력을 기다립니다.");
                  for(var j=15;j>0;j--){ 
                      Thread4.sleep(1000); 
                      if(CH_flag == true){
                          break;
                      }
                      else if(CH_outFlag == true){
                          break;
                      }
                  } 
                  if(CH_flag == false && CH_outFlag == false){
                      replier.reply("Timeout!. Fuck out");
                      CH_players_list.splice(CH_players_list.indexOf(CH_turn_player[0]),1);
                      CH_players.delete(CH_turn_player[0]); 
                      replier.reply(CH_turn_player[0]+", deleted."); 
                  } 
                turn++; 
                CH_outFlag = false;
                CH_flag = false;
              } 
              replier.reply(CH_players_list[0]+" get the thropy!!!!");
              //초기화
              CH_flag = false;
              CH_gameon = false; 
              CH_gamestart = false; 
              CH_players.clear();
              CH_players_list = []; 
              CH_word_history.clear();
              CH_turn_player = []; 
              CH_outFlag = false;
          }
        
      }
      else if(CH_gameon == true && data == "참가"&& CH_gamestart == false){
          CH_players.add(sender);
          replier.reply(sender+"님 성공적으로 게임참여 완료");

      } 

      else{
          replier.reply("현재 게임에 참여할 수 없는 상태입니다.");
      }


  } 

  else if(cmd == "!초성"){
      if(CH_gameon == true && CH_turn_player[0] == sender && CH_gamestart == true){
          var return_6 = CH_right_letter(data);
          if(return_6 == false){
              replier.reply("Wrong word input. Fuck out.");
              CH_players_list.splice(CH_players_list.indexOf(sender),1);
              CH_players.delete(sender);
              replier.reply(sender+", deleted."); 
              CH_outFlag = true;
          }

          else{
              if(dictionary(data)== null){
                replier.reply("No Word data in Dictionary. Fuck out.");
                CH_players_list.splice(CH_players_list.indexOf(sender),1);
                CH_players.delete(sender);
                replier.reply(sender+", deleted.");  
                CH_outFlag = true;
              }
              else if(CH_word_history.has(data) == true){
                replier.reply("Already entered. Fuck out."); 
                CH_players_list.splice(CH_players_list.indexOf(sender),1);
                CH_players.delete(sender);
                replier.reply(sender+", deleted."); 
                CH_outFlag = true;
              } 
              else{
                  replier.reply("Gratz.");
                  CH_flag = true;
                  CH_word_history.add(data);  
              }
          }

      }

      else{
          replier.reply("현재 게임이 시작되지 않았거나, 참여하지 않았거나, 졌거나 혹은 당신의 턴이 아닙니다.");
      }
  } 

  else if (cmd == "!블랙잭"){
    if (BJ_gameon == false && data =="시작"){
        Thread_BJ = java.lang.Thread();
        BJ_gameon = true;
        BJ_cardset = [0, ];
        var count = 0;
        replier.reply(sender+"님 주최하에 블랙잭 게임을 시작하겠습니다.");
        BJ_players.push ({
            deck : [],
            decksum : 0,
            name : sender,
            hit : false,
            burst : false
          });
        while (count < 4 ){
          replier.reply("플레이어를 기다리겠습니다. 경과 시간: "+10*Number(count)+"초");
          Thread_BJ.sleep(10000);
          count ++;
        } 
    
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
              bjcardsum(BJ_players[i]);
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
  

}
 





