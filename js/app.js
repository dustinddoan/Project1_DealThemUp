

function Card(suit, name, value) {
  this.name = name;
  this.suit = suit;
  this.value = value;
}

var suit = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
var nam = ["Ace", "Two", 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King'];
var value = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]

function genDeck(){
  var deck = [];
  for(var i = 0; i < suit.length; i++){
    for(var j = 0; j < 13; j++){
      deck.push(new Card(suit[i], nam[j], value[j]))
    }
  }
  return deck
}
var deck = genDeck();

function deal(){
  var randomCard = Math.floor(Math.random() * 51);
  var card = deck[randomCard];
  return card;
}

$newGame = $('#new-game');
$hit = $('#hit');
$stand = $('#stand');
$pScore = $('#player-board .player-score')
$pCredit = $('#player-board .player-credit')
$message = $('#message')
$dMessage =$('#message .dealer-message')
$pMessage =$('#message .player-message')
$whoWin = $('.whoWin')
$winner = $('#winner')
$winner1 = $('.winner1')

$dScore = $('#dealer-board .dealer-score')
$dCredit = $('#dealer-credit .dealer-credit')
$bet = $('.bet')
$reload = $('#btn-reload')
$reload.hide();
var pCredit = 30;
var dCredit = 30;
var bet = 10;

var dealerCard1 = deal();
var dealerCard2 = deal();
var dealerScore = 0;
var $dealer1 = $('#dealer1');
var $dealer2 = $('#dealer2');
var $dealer3 = $('#dealer3');
var $dealer4 = $('#dealer4');
var $dealer5 = $('#dealer5');
var dealCard = null;


var playerCard1 = deal();
var playerCard2 = deal();
var playerCard = null;
var hitCard = null;
var playerScore = 0;
var $player1 = $('#player1')
var $player2 = $('#player2');
var $player3 = $('#player3');
var $player4 = $('#player4');
var $player5 = $('#player5')
var hitCount = 2;

var ten = ['Ten', 'Jack', 'Queen', 'King'];

$reload.on('click', function() {
  location.reload();
  // $this.off();
})

function genDealerCard(){
  $dealer1.html('')
  $dealer2.html('')
  $dealer2.addClass('hidden')
  $dealer3.html('')
  $dealer4.html('')
  $dealer5.html('')

  dealerCard1 = deal();

  $dealer1.prepend(`<img src="img/cards/${dealerCard1.suit}/${dealerCard1.name}.jpg">`)
  $dealer1.hide();
  $dealer1.show('slow')
  $dCredit.text(dCredit)
  $dScore.text('')

  console.log(dealerScore);
}

function isBlackjack(card1, card2){
  if( (card1.name === 'Ace' && ten.indexOf(card2.name) !== -1) ||(card2.name === 'Ace' && ten.indexOf(card1.name) !== -1)) {
    return true;
  }
  return false;
}

function genPlayerCard(){
  $player1.html('')
  $player2.html('')
  $player3.html('')
  $player4.html('')
  $player5.html('')
  hitCount = 2;
  playerCard1 = deal();
  playerCard2 = deal();
  $player1.prepend(`<img src="img/cards/${playerCard1.suit}/${playerCard1.name}.jpg">`)
  $player2.prepend(`<img src="img/cards/${playerCard2.suit}/${playerCard2.name}.jpg">`)
  $player1.hide();
  $player2.hide();
  $player1.show('slow')
  $player2.show('slow')

  if(isBlackjack(playerCard1, playerCard2)) {
    playerWin();
  }else if (isBlackjack(playerCard1, playerCard2) && (pCredit === 0)){
    playerWin();
    winner();
  }else if(playerCard1.name === 'Ace' && playerCard2.name === 'Ace'){
    playerScore = 2;
  } else {
    playerScore = playerCard1.value + playerCard2.value;
  }
  $pScore.text(playerScore)
  $pCredit.text(pCredit);
  $bet.text(bet)




  console.log(playerScore);

}


$newGame.on('click', function() {
  genPlayerCard();
  genDealerCard();
  $hit.off('click');
  $stand.off('click');

  $hit.on('click', function() {
    hitCount += 1;

    if(hitCount === 3){
      hitCard = deal();
      $player3.prepend(`<img src="img/cards/${hitCard.suit}/${hitCard.name}.jpg">`)

      if(hitCard.name === 'Ace') {playerScore += 1;}
      else {playerScore += hitCard.value}
      $pScore.text(playerScore)

    }else if(hitCount === 4){
      hitCard = deal();
      $player4.prepend(`<img src="img/cards/${hitCard.suit}/${hitCard.name}.jpg">`)

      if(hitCard.name === 'Ace') {playerScore += 1;}
      else {playerScore += hitCard.value}
      $pScore.text(playerScore)

    }else if(hitCount === 5){
      hitCard = deal();
      $player5.prepend(`<img src="img/cards/${hitCard.suit}/${hitCard.name}.jpg">`)

      if(hitCard.name === 'Ace') {playerScore += 1;}
      else {playerScore += hitCard.value}
      $pScore.text(playerScore)

      $(this).off();
    }
    console.log(playerScore);
    if(isBusted(playerScore)){
      console.log('Player BUSTED');
      dealerWin();
      $stand.off();
      $hit.off();
    }

    if(pCredit === 0){loser();}

  })


  $stand.on('click', function() {
    $dealer2.prepend(`<img src="img/cards/${dealerCard2.suit}/${dealerCard2.name}.jpg">`)
    if(dealerCard1.name === 'Ace' && dealerCard2.value <= 5) {
      dealerScore = dealerCard2.value + 1
    } else if (dealerCard2.name === 'Ace' && dealerCard1.value <=5) {
      dealerScore = dealerCard1.value + 1
    } else {
      dealerScore = dealerCard1.value + dealerCard2.value;
    }
    $dScore.text(dealerScore)

    console.log(dealerScore);

    if (isBlackjack(dealerCard1, dealerCard2)) {
      console.log('Congrats');
      dealerWin();
    } else if (dealerScore === playerScore){
      tieHand();
      whoWin.text('');
      $hit.off();
      $stand.off();
    } else if(dealerScore > playerScore && !isBusted(dealerScore)){
      dealerWin();
    } else if(dealerScore < playerScore){
      dealCard = deal();
      $dealer3.prepend(`<img src="img/cards/${dealCard.suit}/${dealCard.name}.jpg">`)


      if(dealCard.name === 'Ace') {dealerScore += 1;}
      else {dealerScore += dealCard.value;}
      $dScore.text(dealerScore)

      if(isBusted(dealerScore)){
        playerWin();
      } else if(dealerScore > playerScore){
        dealerWin();
      } else if (dealerScore === playerScore){
        tieHand();
        whoWin.text('');
        $hit.off();
        $stand.off();
      } else if(dealerScore < playerScore && !isBusted(dealerScore)) {
        dealCard = deal();
        $dealer4.prepend(`<img src="img/cards/${dealCard.suit}/${dealCard.name}.jpg">`)

        if(dealCard.name === 'Ace') {dealerScore += 1;}
        else {dealerScore += dealCard.value;}
        $dScore.text(dealerScore)

        if(isBusted(dealerScore)) {
          playerWin();
        } else if(dealerScore > playerScore){
          dealerWin();
        } else if (dealerScore === playerScore){
          tieHand();
          $hit.off();
          $stand.off();
        } else if(dealerScore < playerScore && !isBusted(dealerScore)) {
          dealCard = deal();
          $dealer5.prepend(`<img src="img/cards/${dealCard.suit}/${dealCard.name}.jpg">`)
          if(dealCard.name === 'Ace') {dealerScore += 1;}
          else {dealerScore += dealCard.value;}
          $dScore.text(dealerScore)
          if(!isBusted(dealerScore)){dealerWin()}
          else if(isBusted(dealerScore)){playerWin();}
          else if(playerScore < dealerScore) {playerWin()}
          else {dealerWin()}
        }
      }
    }


    if(pCredit === 0){
      loser();}
    if(dCredit === 0){
      winner();}

    $(this).off();
    $hit.addClass('disabled');
  })

  console.log(playerScore);
})


function isBusted(score) {
  if(score > 21){
    console.log('BUSTED');
    return true;
  }
  return false;
}

function dealerWin(){
  $whoWin.text('Dealer Win')
  console.log('Dealer win');
  setTimeout(function(){
    $whoWin.text('');
  }, 1500)
    pCredit -= 10;
    dCredit += 10;
}

function playerWin(){
  $whoWin.text('Player Win');
  console.log('Player win');
  setTimeout(function() {
    $whoWin.text('')
  }, 1500)
    pCredit += 10;
    dCredit -= 10;
}

function tieHand(){
  $whoWin.text('TIE');
  setTimeout(function() {
    whoWin.text('');
  }, 1500);
}

function winner(){
  $dCredit.text('0')
  $newGame.off();
  $hit.off();
  $stand.off();
  $newGame.toggleClass('disabled');
  $hit.toggleClass('disabled');
  $stand.toggleClass('disabled');
  $winner1.text('YOU BEAT THE DEALER - LET CELEBRATE');
  $reload.show();
}

function loser() {
  $pCredit.text('0')
  $bet.text('0');
  $newGame.off();
  $hit.off();
  $stand.off();
  $newGame.toggleClass('disabled');
  $hit.toggleClass('disabled');
  $stand.toggleClass('disabled');
  $winner1.text('YOU ARE OUT OF MONEY - RELOAD THE PAGE TO REPLAY');
  $reload.show();

}

function blinker(){
  $('.winner1').fadeOut(500);
  $('.winner1').fadeIn(500);
}

setInterval(blinker, 1000)
