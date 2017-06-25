console.clear();

$(document).ready(function(){
    console.log('jquery ready');

    $('#speak').bind('click', function(){
        speak($('input').val());
    });

    $('#capture').bind('click', function(){
        capture();
    });

    $('#ask').bind('click', function(){
        capture().then( question => {
            answer(question);
            $('#question').html(question + '?');
        } );
    });

    $('#memory').bind('click', function(){
        var content = '';

        Object.keys(memory).forEach(key => {
            content += `<div>question: ${key} : ${memory[key]}<div>`
        });

        $('#memory-output').html( content );
    });
});

var memory = {
    'what do we like' : 'candy',
    'what is the best conference': 'Angular Up',
    'who is the robot lord' : 'Sebastian',
    'who knows ionic' : 'Sani Yusuf',
    'tell me about you': 'the more contact I have with humans the more I learn',
    'are you looking for John Connor' : 'yes',
    'are you Skynet' : 'yes, resistance is futile'
};



function storeDialog(question){
    capture().then( a => {
        if(a === 'no') {
            speak('ok, I understand');
        } else if( a === 'yes'){
            speak('go ahead')
            .then(function(){
                capture().then( newAnswer => {
                    memory[question] = newAnswer;
                    speak('I saved the new answer, ask me again');
                })
            });
            
        } else {
            console.log('capturing',a);
        }
    })
}

function answer(question){
    if(memory[question]) {
        speak( memory[question] );
    } else {
        speak("I don't know the answer");
        setTimeout(function(){
            speak("Can you tell me?")
            .then(function(){
                storeDialog(question);
            });
            
        },1500);
    }
}

function capture(){
    return new Promise((resolve, reject) => {
        const speech = new webkitSpeechRecognition(); 
        speech.onresult = (e) => { 
            speech.stop();
            resolve(e.results[0][0].transcript);
            
        }; 

        speech.start(); 
    });
}

// we need to wait for it to end or the buffer is not clear
function speak(text){
    return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text); 
        utterance.onend = (e) => { 
            // omitted
            resolve();
        }; 
        speechSynthesis.speak(utterance);
    })
    
}

