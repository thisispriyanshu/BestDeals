//Import packages
const axios = require('axios')
const cheerio=require('cheerio')
const { async } = require('q')
require("dotenv").config();
const accountSID=process.env.TWILIO_AACOUNT_SID
const authToken=process.env.TWILIO_AUTH_TOKEN
const client=require("twilio")(accountSID,authToken);


const url="https://www.amazon.in/Zebronics-ZEB-NC3300-Powered-Laptop-Cooling/dp/B07YWS9SP9/ref=sr_1_omk_4?crid=WY6OJP6EJYVW&keywords=laptop+cooling+stand&qid=1656235752&sprefix=laptop+cooling+stand%2Caps%2C227&sr=8-4"

const product = {name:"",price:"",link:""}

const handle=setInterval(scrap,20000);
async function scrap(){
    const {data}=await axios.get(url)
    // console.log(data)
    const $=cheerio.load(data);
    const item= $("div#dp-container");
    product.name=$(item).find("h1 span#productTitle").text().trim();
    const priceNum=$(item).find("span .a-price-whole").first().text().replace(/[,.]/g,"");
    product.price=parseInt(priceNum);
    product.link=url;
    console.log(product)

    if(product.price<600){
        client.messages.create({
            body:`The price of ${product.name} went below ${product.price}. Link -> ${product.link}`,
            from:'+19794014570',
            to:'+919305249162'
        }).then((message)=>{
            console.log(message)
            clearInterval(handle);
        })
    }
}

scrap()