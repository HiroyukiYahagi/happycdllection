<?php
require_once('./lib/phirehose/Account.php');
require_once('./lib/phirehose/Phirehose.php');
require_once('./lib/phirehose/OauthPhirehose.php');
require_once('./lib/idiorm/dbconnect.php');

/**
 * Example of using Phirehose to display a live filtered stream using track words 
 */
class FilterTrackConsumer extends OauthPhirehose
{

  public $data_count = 0;

  public function enqueueStatus($status)
  {

    $data = json_decode($status, true);
    if (is_array($data) && isset($data['user']['screen_name'])) {
      $this->data_count ++;
      $this->logging("start:".$this->data_count);
      $this->insertedTweet($data);
      $this->logging("end:".$this->data_count);

      // var_dump($data);
      // echo "<br/>";
      // echo "<br/>";
      // echo "<br/>";

    }
  }

  private function insertedTweet($data)
  {
    //配列から必要な情報をパース
    $twitter_user_id = $data['user']['id'];

    //ユーザが存在するか確認
    $user = $this->getUser($twitter_user_id);

    //ユーザの作成
    if($user == null){
      $user_name = $data['user']['name'];
      $user_screen_name = $data['user']['screen_name'];
      $user_img_url = $data['user']['profile_image_url'];
      $user = $this->createUser($twitter_user_id, $user_name, $user_screen_name, $user_img_url);
    }

    //必要なデータのパース
    $created = $data['created_at'];
    $text = $data['text'];
    $user_id = $user->id;
    $tweet_id = $data['id'];

    //ツイートの挿入
    $this->createTweet($user_id, $tweet_id, $text, $created);

  }

  private function getUser($twitter_user_id)
  {
    $this->logging('checked id:'.$twitter_user_id);
    $user = null;
    try {
      $user = ORM::for_table('twitter_users')->where("user_id", $twitter_user_id)->find_one();
    } catch (Exception $e) {
      $this->logging('捕捉した例外: '.$e->getMessage());
    }

    return $user;
  }

  private function createUser($twitter_user_id, $user_name, $user_screen_name, $user_img_url)
  {
    $this->logging('inserted_id:'.$twitter_user_id);

    try {
      $user = ORM::for_table('twitter_users')->create();
      $user->user_id = $twitter_user_id;
      $user->user_name = $user_name;
      $user->user_screen_name = $user_screen_name;
      $user->user_img_url = $user_img_url;
      $user->save();
    } catch (Exception $e) {
      $this->logging('捕捉した例外: '.$e->getMessage());
    }
    return $user;
  }

  private function createTweet($user_id, $tweet_id, $text, $created)
  {
    $this->logging('inserted_tweet_id:'.$tweet_id);

    try {
      $tweet = ORM::for_table('tweets')->create();
      $tweet->user_id = $user_id;
      $tweet->tweet_id = $tweet_id;
      $tweet->tweet_text = $text;
      $tweet->created = $created;
      $tweet->save();

    } catch (Exception $e) {
      $this->logging('捕捉した例外: '.$e->getMessage());
    }
  }

  private function logging($msg){
    error_log($msg);
  }

}


// Start streaming
$sc = new FilterTrackConsumer(OAUTH_TOKEN, OAUTH_SECRET, Phirehose::METHOD_FILTER);
$sc->setTrack(['楽し', '幸せ', 'ラッキー', '嬉']);
// $sc->setTrack(['iPhone', 'iPod', 'iPad', 'iOS']);
$sc->setLang("ja");
$sc->consume();

