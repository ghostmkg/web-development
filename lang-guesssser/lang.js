// const franc= require("franc");
// const langs=require("langs");
import {franc} from "franc";
import langs from "langs";
import colors from "colors";

// console.log(france("Alle menslike wesens word vry"));
const input=process.argv[2];
const langCode=franc(input);
if(langCode==="und"){
    console.log("Sorry, Couldnt figure it out!!".bgRed)
}else{
    const language=langs.where("3", langCode);
    console.log(`Our best guess is: ${language.name}`.bgGreen);
}

