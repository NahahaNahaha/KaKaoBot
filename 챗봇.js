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
     "3. !사전 {단어}를 입력하면\n{단어}의 정의를 알려줍니다.\n\n4. !룰렛 을 입력하면 1~100 중 랜덤으로 정수 하나를 내놓습니다.");
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
    if(result_4<=10){
        replier.reply(result_4+"가 나왔습니다...\n"+sender+"님~ 너무 한심하네요~");
    }
    else if(result_4<=50){
        replier.reply(result_4+"가 나왔습니다...\n"+sender+"님 나쁘지는 않네요ㅋ");
    }
    else if(result_4<=80){
        replier.reply(result_4+"가 나왔습니다...\n"+sender+"님 괜찮은데요? ");
    }
    else if(result_4<=90){
        replier.reply(result_4+"가 나왔습니다...\n"+sender+"님 상위권 축하드려요~");
    } 
    else if(result_4<=99){
        replier.reply(result_4+"가 나왔습니다...\n"+sender+"님 최상위권이네요^^!");
    }
    else{
        replier.reply(result_4+"가 나왔습니다.\n"+sender+"님이 왕좌에 오르셨습니다.");
        replier.reply(result_4+"가 나왔습니다.\n"+sender+"님이 왕좌에 오르셨습니다.");
        replier.reply(result_4+"가 나왔습니다.\n"+sender+"님이 왕좌에 오르셨습니다.");
        replier.reply(result_4+"가 나왔습니다.\n"+sender+"님이 왕좌에 오르셨습니다.");
        replier.reply(result_4+"가 나왔습니다.\n"+sender+"님이 왕좌에 오르셨습니다.");
    }
    
 }

}
