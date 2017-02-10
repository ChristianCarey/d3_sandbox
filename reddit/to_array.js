var obj = {"AskReddit":15652682,"The_Donald":364364,"politics":3293964,"funny":15496275,"pics":15268808,"nba":520433,"todayilearned":15486087,"worldnews":15298316,"news":12766077,"gifs":12716418,"aww":13699447,"videos":14580189,"Overwatch":768722,"gaming":14612167,"BlackPeopleTwitter":846849,"movies":14287095,"nfl":575523,"leagueoflegends":952540,"Showerthoughts":10698955,"AdviceAnimals":4148824,"soccer":571007,"relationships":604301,"mildlyinteresting":10810566,"SquaredCircle":181034,"me_irl":504820,"Jokes":10447440,"GlobalOffensive":465834,"dankmemes":202216,"pcmasterrace":761664,"wholesomememes":372882,"tifu":10467556,"hiphopheads":476167,"IAmA":15117226,"LifeProTips":11159249,"DotA2":324597,"anime":461882,"hockey":313609,"television":11507348,"nottheonion":10304083,"WTF":4733004,"conspiracy":429213,"Rainbow6":104739,"EnoughTrumpSpam":73888,"europe":1237818,"interestingasfuck":902420,"dataisbeautiful":10234035,"rupaulsdragrace":61223,"NintendoSwitch":98799,"technology":5166173,"4chan":771176,"TumblrInAction":343057,"canada":243637,"MMA":246057,"youtubehaiku":319570,"hearthstone":418895,"australia":133092,"PrequelMemes":53760,"OldSchoolCool":10035189,"forhonor":31284,"SubredditDrama":253791,"CFB":237612,"CringeAnarchy":173957,"Games":776812,"StarWars":562891,"2007scape":102015,"DestinyTheGame":302795,"food":10320609,"unitedkingdom":151472,"explainlikeimfive":12565021,"KotakuInAction":76387,"wow":378661,"books":11680122,"trashy":277696,"space":10675774,"TrollXChromosomes":209440,"IASIP":162175,"trees":917788,"Futurology":10261322,"de":51111,"baseball":372564,"UpliftingNews":10145874,"photoshopbattles":10290031,"legaladvice":181509,"RocketLeague":272311,"bestof":4688873,"Music":13870796,"personalfinance":10233418,"Art":9885691,"meirl":181097,"xboxone":323485,"FireEmblemHeroes":32373,"PoliticalDiscussion":124107,"Tinder":304396,"atheism":2015099,"GetMotivated":10197729,"streetwear":185607,"sports":10495513,"Android":731734,"DIY":10707616,"ukpolitics":70148}

var array = [];

var id = 0;

for (name in obj) {
  console.log(name)
  var new_obj = {}
  new_obj['name'] = name
  new_obj['size'] = obj[name]
  new_obj['id'] = id;
  array.push(new_obj)
  id++;
}

console.log(array)