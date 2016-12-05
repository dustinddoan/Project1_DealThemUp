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

$dScore = $('#dealer-board .dealer-score')
$dCredit = $('#dealer-credit .dealer-credit')
$bet = $('.bet')
var pCredit = 20;
var dCredit = 20;
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


function genDealerCard(){
  $dealer1.html('')
  $dealer2.html('')
  $dealer2.addClass('hidden')
  $dealer3.html('')
  $dealer4.html('')
  $dealer5.html('')

  dealerCard1 = deal();
  $dealer1.prepend(`<img src="img/cards/${dealerCard1.suit}/${dealerCard1.name}.jpg">`)
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

  if(isBlackjack(playerCard1, playerCard2)) {
    playerWin();
  } else {
    playerScore = playerCard1.value + playerCard2.value;
    $pScore.text(playerScore)
    $pCredit.text(pCredit);
    $bet.text(bet)
  }




  console.log(playerScore);

}


$newGame.on('click', function() {
  genPlayerCard();
  genDealerCard();
  $hit.off('click');
  $stand.off('click')

  $hit.on('click', function() {
    hitCount += 1;

    if(hitCount === 3){
      hitCard = deal();
      playerScore += hitCard.value;
      $pScore.text(playerScore)

      $player3.prepend(`<img src="img/cards/${hitCard.suit}/${hitCard.name}.jpg">`)


    }else if(hitCount === 4){
      hitCard = deal();
      playerScore += hitCard.value;
      $pScore.text(playerScore)

      $player4.prepend(`<img src="img/cards/${hitCard.suit}/${hitCard.name}.jpg">`)

    }else if(hitCount === 5){
      hitCard = deal();
      playerScore += hitCard.value;
      $pScore.text(playerScore)

      $player5.prepend(`<img src="img/cards/${hitCard.suit}/${hitCard.name}.jpg">`)

      $(this).off();
    }
    console.log(playerScore);
    if(isBusted(playerScore)){
      console.log('Player BUSTED');
      dealerWin();
      $stand.off();
      $hit.off();
    }

    if(pCredit === 0){
      $pCredit.text('0')
      $bet.text('0');
      $newGame.off();
      $hit.off();
      $stand.off();

      $winner.text('YOU ARE OUT OF MONEY - RELOAD THE PAGE TO REPLAY');
      console.log('GO HOME');
    }

  })


  $stand.on('click', function() {
    $dealer2.prepend(`<img src="img/cards/${dealerCard2.suit}/${dealerCard2.name}.jpg">`)
    dealerScore = dealerCard1.value + dealerCard2.value;
    $dScore.text(dealerScore)
    console.log(dealerScore);

    if (isBlackjack(dealerCard1, dealerCard2)) {
      console.log('Congrats');
      pCredit -= 10;
      dCredit += 10;
    } else if (dealerScore === playerScore){
      $whoWin.text('TIE');
      $hit.off();
      $stand.off();
    } else if(dealerScore > playerScore && !isBusted(dealerScore)){
      dealerWin();
    } else if(dealerScore < playerScore){
      dealCard = deal();
      $dealer3.prepend(`<img src="img/cards/${dealCard.suit}/${dealCard.name}.jpg">`)
      dealerScore += dealCard.value;
      $dScore.text(dealerScore)

      if(isBusted(dealerScore)){
        playerWin();
      } else if(dealerScore > playerScore){
        dealerWin();
      } else if(dealerScore < playerScore) {
        dealCard = deal();
        $dealer4.prepend(`<img src="img/cards/${dealCard.suit}/${dealCard.name}.jpg">`)
        dealerScore += dealCard.value;
        $dScore.text(dealerScore)

        if(isBusted(dealerScore)) {
          playerWin();
        }else if(dealerScore > playerScore){
          dealerWin();
        }


      }


    }


    if(pCredit === 0){
      $pCredit.text('0')
      $bet.text('0');
      $newGame.off();
      $hit.off();
      $stand.off();
      $winner.text('YOU ARE OUT OF MONEY - RELOAD THE PAGE TO REPLAY');
    }
    if(dCredit === 0){
      $dCredit.text('0')
      $newGame.off();
      $hit.off();
      $stand.off();
      $winner.text('YOU BEAT THE DEALER - LET CELEBRATE');
    }
    $(this).off();
    $hit.off();
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
  // $dMessage.text(dealerScore);
  // $pMessage.text(playerScore);
  $whoWin.text('Dealer Win')

  console.log('Dealer win');
  setTimeout(function(){
    $whoWin.text('');
  }, 1500)
    pCredit -= 10;
    dCredit += 10;
}

function playerWin(){
  // $dMessage.text(`Dealer Score: ${dealerScore}`);
  // $pMessage.text(`Player Score ${playerScore}`);
  $whoWin.text('Player Win');
  console.log('Player win');

  setTimeout(function() {
    $whoWin.text('')
  }, 1500)
    pCredit += 10;
    dCredit -= 10;

}
