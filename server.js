var http=require('http');
var cheerio=require('cheerio');
var querystring=require('querystring');
var query=querystring.stringify({searchKeyWords:'经济'});

// url='http://www.yicai.com/search.html?'+query;
var Data=[];
function Filter(html){
    var $=cheerio.load(html);
    var content=$(".f-cb");
    content.each(function(item){
         var pic=$(this).find("dt").find("img").attr("data-original");
         var href=$(this).find("dd").find("a").attr("href");
         var text=$(this).find("dd").find("a").text();
         Data.push({"pic":pic,"href":href,"text":text});
           console.log(pic);
    })
    return Data;
}

url='http://www.yicai.com/news/finance/';

http.get(url,function(res){
    var html="";
    res.on('data',function(data){
         html+=data;
    })
    res.on('end',function(){
       var data=Filter(html);
     
    })
})


var postHTML=
'<html><body><form  method="post">'+
 '<select  name="website" style="width: 200px; height: 30px;font-size: 14px;margin-left: 680px;margin-top: 140px;">'+
  '<option >第一财经</option>'+
  '<option >搜狐财经</option>'+
  '<option >腾讯财经</option>'+
  '<option>凤凰财经</option></select>'+
  '<button name="submit" style=" width: 60px;height: 30px;margin-left: 20px;cursor: pointer;outline: none; border-radius: 4px;border: none;background-color: #428bca;color: #fff;">搜索</button>'+
  '</form></body></html>';


http.createServer(function (request, response) {
   var body="";
   request.on("data",function(chunk){
      body+=chunk;
   });
   request.on("end",function(){
      body=querystring.parse(body);
      response.writeHead(200, {'Content-Type': 'text/html'});
      if (body.website) {
          if(body.website=="第一财经"){
           response.write(postHTML);
            for(var i=1;i<Data.length;i++){
              response.write("<a href=" + Data[i].href +  " style='margin-left:650px;'>"+  Data[i].text + "</a>" + "<br>");

                 }

          }




      }
       else{
         response.write(postHTML);
       }

       response.end();
   });
 


 // for(var i=1;i<Data.length;i++){
 //   response.write("<a href=" + Data[i].href +  ">"+  Data[i].text + "</a>" + "<br>");
 //   }

    
}).listen(process.env.PORT ||3000);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:3000/');
