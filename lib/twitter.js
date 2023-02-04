import { Client } from "twitter-api-sdk";
import axios from "axios";

const twitter_key = process.env.NEXT_PUBLIC_TWITTER_KEY;
const twitter_secret = process.env.NEXT_PUBLIC_TWITTER_SECRET;
const twitter_bearer_token = process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN;
console.log('twitter_bearer_token', twitter_bearer_token);
const client = new Client(twitter_bearer_token.toString());
//curl "https://api.twitter.com/2/users/by/username/topshotturtles?user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld" -H "Authorization: Bearer $BEARER_TOKEN"

//use axios to execute a GET request to the Twitter API to find the user by username
// set to no-cors to fetch with CORS disabled

export async function getTwitterUserData(username) {
    console.log(client.tweets)
    const { data, includes } = await client.tweets.findTweetsById({
        "ids": [
          "1557438090897137665"
        ],
        "tweet.fields": [
          "attachments"
        ],
        "expansions": [
          "attachments.media_keys"
        ],
        "media.fields": [
          "alt_text",
          "duration_ms",
          "preview_image_url",
          "public_metrics",
          "variants"
        ]
      });
    
      if (!data) throw new Error("Couldn't retrieve Tweet");
    
      console.log("\nTweet text:\t" + data[0].text);
      console.log("Media:\t\t" + includes.media[0].type);
      console.log("Alt text:\t" + includes.media[0].alt_text);
      console.log("Views:\t\t" + includes.media[0].public_metrics.view_count);
    
      console.table(includes.media[0].variants, ['bit_rate', 'url']);
    
      // dump whole JSON data objects
      // console.log("data", JSON.stringify(data, null, 1));
      // console.log("includes", JSON.stringify(includes, null, 1));
    
}