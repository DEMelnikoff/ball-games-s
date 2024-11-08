function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

filename_prefix=jsPsych.data.getURLVariable('PROLIFIC_PID');
if (!filename_prefix) { filename_prefix=jsPsych.randomization.randomID(10) };
filename1=filename_prefix+"_1.csv";
filename2=filename_prefix+"_2.csv";
myfilename=filename_prefix+".csv";

experiment_id= "HVaRwRG3aAzy";

// Generate separate random values for streak and money
const streak_then_dist = Math.random() < 0.5;
var streak1 = streak_then_dist;
var streak2 = !streak_then_dist;

const second_stage_money = Math.random() < 0.5;
var ismoney1 = false;
var ismoney2 = second_stage_money;


function FirstExperiment(mytargetBig, mystreak, ismoney)
{

    var p = {};
    p.consent = {
        type: "external-html",
        url: "./html/consent.html",
        cont_btn: "advance",
    };
    // save condition, date, and time
    var targetBig = mytargetBig;
    var streak = mystreak;
    const gameName = (streak) ? 'Streak-o-Rama' : 'Close Call';
    if (streak) {
        var inst = `<div class='instructions'>

        <p><strong>${gameName}</strong>. The goal of ${gameName} is to maximize the length of your average hit streak. For each consecutive hit, your current "hit streak" will increase by 1. Try your best to make your hit streaks as long as possible! 
        Follow the instructions in the game area, then play ${gameName}. We'll let you know when time is up.</p></div>`
    } else {
        var inst = `<div class='instructions'>

        <p><strong>${gameName}</strong>. The goal of ${gameName} is to minimize your average distance from the target. After each shot, your distance from the target will be computed. Try your best to get as close to the target as possible! 
        Follow the instructions in the game area, then play ${gameName}. We'll let you know when time is up.</p></div>`
    }

    jsPsych.data.addProperties({
        targetBig1: targetBig,
        streak1: streak,
        ismoney1: ismoney,
        date1: new Date(),
        PROLIFIC_PID: jsPsych.data.getURLVariable('PROLIFIC_PID'),
    });

   /*
    *
    *  INSTRUCTIONS
    *
    */
        
    p.inst = {}

    // instruction pages
    var block1page1 = `<div class='instructions'>

    <p><b>Welcome to Ball Games!</b></p>

    <p>For the next 5 to 8 minutes, you'll be helping us 
    answer the following question: "What makes some games more immersive and engaging than others?"</p>

    <p>Specifically, you'll play three different ball games and provide feedback about each one. 
    By playing games and providing feedback, you'll help us understand how to design games 
    that are as immersive and engaging as possible.</div>`; 

    var block2page1 = `<div class='instructions1a'>
    <p><strong>Game #1: Hole in One</strong></p>

    <p>The first ball game you'll play is called Hole in One!</p>

    <p>After you finish Hole in One, you'll answer questions about your experience.</p>

    <p>When you're ready to play, press "Next."</p></div>`; 

    var block3page1 = `<div class='instructions'>

    <p>Thank you! Next, you'll spend a few minutes playing two more games. After each game, 
    you'll answer some questions about your experience. When you're ready, 
    press "Next" to continue.</p></div>`; 

    var block4page1 = `<div class='instructions'>

    <p>Thank you! Next, you'll complete a brief demographics survey. When you're ready, 
    press "Next" to continue.</p></div>`; 

    // combine pages into blocks
    p.inst.block1 = {
        type: "instructions",
        pages: [block1page1],
        show_clickable_nav: true,
        allow_backward: true
    };

    p.inst.block2 = {
        type: "instructions",
        pages: [block2page1],
        show_clickable_nav: true,
        allow_backward: true
    };

    p.inst.block3 = {
        type: "instructions",
        pages: [block3page1],
        show_clickable_nav: true,
        allow_backward: true
    };

    p.inst.block4 = {
        type: "instructions",
        pages: [block4page1],
        show_clickable_nav: true,
        allow_backward: true
    };

   /*
    *
    *  TASKS
    *
    */

    p.tasks = {};

    // parameterize "Hole in One"
    p.tasks.holeInOne = {
        type: 'hole-in-one-game',
        stimulus: holeInOne.run,
        total_shots: 10,  
        canvas_size: [475, 900],
        ball_color: 'white',
        ball_size: 10,
        ball_xPos: .13,
        ball_yPos: .5,
        wall_width: 75,
        wall_color: '#797D7F',
        wall_xPos: .9,
        hole_size: 75,
        friction: .02,
        tension: .03,
        prompt: `<div class='instructions'>

        <p><strong>Hole in One</strong>. The goal of Hole in One is to shoot the ball through the hole. 
        Follow the instructions in the game area, then play Hole in One. 
        We'll let you know when time is up.</p></div>`
    };

    // parameterize "Target Practice"
    p.tasks.slingshotGame = {
        type: 'slingshot1-game',
        stimulus: slingshot1.run,
        total_shots: 25,  
        canvas_size: [475, 900],
        ball_color: 'white',
        ball_size: 10,
        ball_xPos: .13,
        ball_yPos: .5,
        target_color: 'red',
        target_color_hit: 'green',
        target_size: targetBig == 1 ? 45 : 10,
        game_type: streak,
        money: ismoney,
        target_xPos: .9,
        target_yPos: [.2, .4, .5, .6, .8],
        friction: .02,
        tension: .03,
        prompt: inst,
    };


    // scales
    var zeroToExtremely = ['0<br>A little', '1', '2', '3', '4<br>Very', '5', '6', '7', '8<br>Completely'];
    var zeroToALot = ['0<br>A little', '1', '2', '3', '4', '5', '6', '7', '8<br>A lot'];

    // constructor functions
    var flowQs = function(shortName, fullName) {
        this.type = 'survey-likert';
        this.preamble = `<div class='qInfo'>

        <p><strong>Thank you for playing ` + fullName + `!</strong></p>

        <p>During ` + fullName + `, to what extent did you feel immersed and engaged in what you were doing?<br>
        Report how immersed and engaged you felt by answering the following questions.</p></div>`;
        this.questions = [
            {prompt: 'During ' + fullName + ', how <b>absorbed</b> did you feel in what you were doing?',
            name: 'F_absorbed_' + shortName,
            labels: ['0<br>A little<br>absorbed', '1', '2', '3', '4<br>Quite<br>absorbed', '5', '6', '7', '8<br>Completely<br>absorbed']},
            {prompt: 'During ' + fullName + ', how <b>immersed</b> did you feel in what you were doing?',
            name: 'F_immersed_' + shortName,
            labels: ['0<br>A little<br>immersed', '1', '2', '3', '4<br>Quite<br>immersed', '5', '6', '7', '8<br>Completely<br>immersed']},
            {prompt: 'During ' + fullName + ', how <b>engaged</b> did you feel in what you were doing?',
            name: 'F_engaged_' + shortName,
            labels: ['0<br>A little<br>engaged', '1', '2', '3', '4<br>Quite<br>engaged', '5', '6', '7', '8<br>Completely<br>engaged']},
            {prompt: 'During ' + fullName + ', how <b>engrossed</b> did you feel in what you were doing?',
            name: 'F_engrossed_' + shortName,
            labels: ['0<br>A little<br>engrossed', '1', '2', '3', '4<br>Quite<br>engrossed', '5', '6', '7', '8<br>Completely<br>engrossed']},
        ];
        this.randomize_question_order = false;
        this.scale_width = 600;
    };

    var enjoyQs = function(shortName, fullName) {
        this.type = 'survey-likert';
        this.preamble = `<div class='qInfo'>

        <p>Below are a few more questions about ` + fullName + `.</p><p>Instead of asking about immersion and engagement, 
        these questions ask about <strong>enjoyment</strong>.<br>Report how much you <strong>enjoyed</strong> 
        playing ` + fullName + ` by answering the following questions.</p></div>`;
        this.questions = [
            {prompt: 'How much did you <b>enjoy</b> playing ' + fullName + '?',
            name: 'E_enjoyable_' + shortName,
            labels: ['0<br>A little', '1', '2', '3', '4<br>Moderately', '5', '6', '7', '8<br>A lot']},
            {prompt: 'How much did you <b>like</b> playing ' + fullName + '?',
            name: 'E_like_' + shortName,
            labels: ['0<br>A little', '1', '2', '3', '4<br>Moderately', '5', '6', '7', '8<br>A lot']},
            {prompt: 'How much did you <b>dislike</b> playing ' + fullName + '?',
            name: 'E_dislike_' + shortName,
            labels: ['0<br>A little', '1', '2', '3', '4<br>Moderately', '5', '6', '7', '8<br>A lot']},
            {prompt: 'How much <b>fun</b> did you have playing ' + fullName + '?',
            name: 'E_fun_' + shortName,
            labels: ['0<br>A little', '1', '2', '3', '4<br>Moderately', '5', '6', '7', '8<br>A lot']},
            {prompt: 'How <b>entertaining</b> was ' + fullName + '?',
            name: 'E_entertaining_' + shortName,
            labels: ['0<br>A little', '1', '2', '3', '4<br>Moderately', '5', '6', '7', '8<br>Extremely']},
        ];
        this.randomize_question_order = false;
        this.scale_width = 600;
    };

    p.Qs = {};


    if (streak==true)
        {
            if (targetBig==true)
                {
                var instructpage1a=`<div class='instructions1a'>
                    <p><strong>Game #2: ${gameName}</strong></p>
                    <p>The next ball game you'll play is called ${gameName}!</p>
                    <p>The goal of ${gameName} is to hit the target (the red circle) as many times in a row as possible with the white ball.</p>
                    <p><img src="images/bigtargetshoot.gif" alt="Game Demonstration" style="width: 500px; height: auto;"></img></p>
                    </div>`;
                var instructpage2;
                if (ismoney==false)
                    {
                        instructpage2=`<div class='instructions2'>
    
                        <p>For each consecutive hit, your current "hit streak" will increase by 1.<br> 
    
                        If you miss, your current "hit streak" will go back to 0.</p>
    
                        <p>At the end of the game, the average length of your hit streaks will be computed.<br>
    
                        Success entails maximizing the length of your average hit streak.</p>               
    
                        </div>`;
                    }
                    else
                    {
                        instructpage2=`<div class='instructions2'>
    
                        <p><strong>Bonus Opportunity!</strong></p>
    
                        <p>The 10 players with the longest average "hit streak" will each receive $20!</p>
    
                        <p>For each consecutive hit, your current "hit streak" will increase by 1.<br> 
    
                        If you miss, your current "hit streak" will go back to 0.</p>
    
                        <p>At the end of the game, the average length of your hit streaks will be computed.<br>
    
                        If your average hit streak is in the top 10, you'll receive a $20 bonus.</p>
    
                        </div>`;
                    }     
                }
            else
                {
                var instructpage1a=`<div class='instructions1a'>
                    <p><strong>Game #2: ${gameName}</strong></p>
                    <p>The next ball game you'll play is called ${gameName}!</p>
                    <p>The goal of ${gameName} is to hit the target (the red circle) as many times in a row as possible with the white ball.</p>
                    <p><img src="images/smalltargetshoot.gif" alt="Game Demonstration" style="width: 500px; height: auto;"></img></p>
                    </div>`;
                var instructpage2;
                if (ismoney==false)
                {
                    instructpage2=`<div class='instructions2'>

                    <p>For each consecutive hit, your current "hit streak" will increase by 1.<br> 

                    If you miss, your current "hit streak" will go back to 0.</p>

                    <p>At the end of the game, the average length of your hit streaks will be computed.<br>

                    Success entails maximizing the length of your average hit streak.</p>               

                    </div>`;
                }
                else
                {
                    instructpage2=`<div class='instructions2'>

                    <p><strong>Bonus Opportunity!</strong></p>

                    <p>The 10 players with the longest average "hit streak" will each receive $20!</p>

                    <p>For each consecutive hit, your current "hit streak" will increase by 1.<br> 

                    If you miss, your current "hit streak" will go back to 0.</p>

                    <p>At the end of the game, the average length of your hit streaks will be computed.<br>

                    If your average hit streak is in the top 10, you'll receive a $20 bonus.</p>

                    </div>`;
                }            
                }
            var instructpage4=`<div class='instructions4'>
                <p>Aim the ball towards the target and try your best to make your hit streaks as long as possible!</p></div>`; 
        }
    else
        {
            if (targetBig==true)
                {
                var instructpage1a=`<div class='instructions1a'>
                <p><strong>Game #2: ${gameName}</strong></p>
                <p>The next ball game you'll play is called ${gameName}!</p>
                <p>The goal of ${gameName} is to shoot the white ball as close to the target (the red circle) as possible.</p>
                <p><img src="images/bigtargetshoot.gif" alt="Game Demonstration" style="width: 500px; height: auto;"></img></p>
                </div>`;
                var instructpage2;
                if (ismoney==false)
                {
                    instructpage2=`<div class='instructions2'>
                    <p>After each shot, your distance from the target will be computed.<br>
                    Hitting the target corresponds to a distance of 0.</p>
                    <p>At the end of the game, your average distance from the target will be computed.<br>
                    Success entails minimizing your average distance from the target.</p>
                    </div>`;
                }
                else
                {
                    instructpage2=`<div class='instructions2'>

                    <p><strong>Bonus Opportunity!</strong></p>

                    <p>The 10 players with the closest average distance from the target will each receive $20!</p>

                    <p>After each shot, your distance from the target will be computed.<br>

                    Hitting the target corresponds to a distance of 0.</p>

                    <p>At the end of the game, your average distance from the target will be computed.<br>

                    If you're one of the top 10 closest shooters, you'll receive a $20 bonus.</p>

                    </div>`;
                }
                }
            else
                {
                var instructpage1a=`<div class='instructions1a'>
                <p><strong>Game #2: ${gameName}</strong></p>
                <p>The next ball game you'll play is called ${gameName}!</p>
                <p>The goal of ${gameName} is to shoot the white ball as close to the target (the red circle) as possible.</p>
                <p><img src="images/smalltargetshoot.gif" alt="Game Demonstration" style="width: 500px; height: auto;"></img></p>
                </div>`;  
                var instructpage2;
                if (ismoney==false)
                {
                    instructpage2=`<div class='instructions2'>
                    <p>After each shot, your distance from the target will be computed.<br>
                    Hitting the target corresponds to a distance of 0.</p>
                    <p>At the end of the game, your average distance from the target will be computed.<br>
                    Success entails minimizing your average distance from the target.</p>
                    </div>`;
                }
                else
                {
                    instructpage2=`<div class='instructions2'>

                    <p><strong>Bonus Opportunity!</strong></p>

                    <p>The 10 players with the closest average distance from the target will each receive $20!</p>

                    <p>After each shot, your distance from the target will be computed.<br>

                    Hitting the target corresponds to a distance of 0.</p>

                    <p>At the end of the game, your average distance from the target will be computed.<br>

                    If you're one of the top 10 closest shooters, you'll receive a $20 bonus.</p>

                    </div>`;
                }
                }
            var instructpage4=`<div class='instructions4'>
            <p>Aim the ball towards the target and try your best to get as close to the target as possible!</p></div>`; 
        }
    
    var instructpage_before2;
    var instructpage_after4;
    p.inst.instruct1 = {
        type: "instructions",
        pages: [instructpage1a],
        show_clickable_nav: true,
        allow_backward: true
    };



    p.Qs.goalquestion = {
        type: 'survey-multi-choice',
        preamble: `<div class='question'>
        <p>To ensure that you understand this information, please answer the following question.</p></div>`,
        questions: [
            {prompt: `What is the goal of ${gameName}?`, name: 'rwrdChk1', required: true, 
            options: ["To hit the target as many times in a row as possible", "To make the ball reach the greatest height", "To shoot the ball as close to the target as possible", "To hit the target at least once per 5 attempts", "To avoid hitting the target"]}, 
        ],
        on_finish: function(data){
            user_answer1=JSON.parse(data.responses).rwrdChk1;

    if (user_answer1=="To hit the target as many times in a row as possible" && streak==true)
    {
        instructpage_before2=`<div class='instructions_before2'>
        <p><strong>You were correct!</strong></p>
        <p>The correct answer was:</p><p>To hit the target as many times in a row as possible </p> 
        </div>`;
    }
    else if (user_answer1!="To hit the target as many times in a row as possible" && streak==true)
    {
        instructpage_before2=`<div class='instructions_before2'>
        <p><strong>You were incorrect!</strong></p>
        <p>The correct answer was:</p><p>To hit the target as many times in a row as possible </p> 
        </div>`;
    }
    else if (user_answer1=="To shoot the ball as close to the target as possible" && streak==false)
    {
        instructpage_before2=`<div class='instructions_before2'>
        <p><strong>You were correct!</strong></p>
        <p>The correct answer was:</p><p>To shoot the ball as close to the target as possible </p> 
        </div>`;
    }
    else if (user_answer1!="To shoot the ball as close to the target as possible" && streak==false)
    {
        instructpage_before2=`<div class='instructions_before2'>
        <p><strong>You were incorrect!</strong></p>
        <p>The correct answer was:</p><p>To shoot the ball as close to the target as possible </p> 
        </div>`;
    }

    }
    }

    p.inst.instruct234 = {
        type: "instructions",
        pages: function () {
            return [instructpage_before2, instructpage2, instructpage4];
        },
        show_clickable_nav: true,
        allow_backward: true
    };
    if (ismoney==false)
    {
        rewardprompt=`In ${gameName}, what must you do to succeed?`;
    }
    else
    {
        rewardprompt=`In ${gameName}, what must you do to win $20?`
    }
    p.Qs.rewardquestion = {
        type: 'survey-multi-choice',
        preamble: `<div class='question'>
        <p>To ensure that you understand this information, please answer the following question.</p></div>`,
        questions: [
            {prompt: rewardprompt, name: 'rwrdChk2', required: true, 
            options: ["Maximize my total hits", "Maximize the length of my average hit streak", "Minimize my total hits", "Minimize my average distance from the target", "Maximize the number of times I have 3 consecutive misses", "Maximize the number of times I get 3 consecutive hits"]}, 
        ],
        on_finish: function(data){
            user_answer2=JSON.parse(data.responses).rwrdChk2;
    

    if (user_answer2=="Maximize the length of my average hit streak" && streak==true)
    {
        instructpage_after4=`<div class='instructions4'>
            <p><strong>You were correct!</strong></p>
            <p>The correct answer was:</p><p>Maximize the length of my average hit streak</p> </div>`; 
    }
    else if (user_answer2!="Maximize the length of my average hit streak" && streak==true)
    {
        instructpage_after4=`<div class='instructions4'>
            <p><strong>You were incorrect!</strong></p>
            <p>The correct answer was:</p><p>Maximize the length of my average hit streak</p> </div>`; 
    }
    else if (user_answer2=="Minimize my average distance from the target" && streak==false)
    {
        instructpage_after4=`<div class='instructions4'>
            <p><strong>You were correct!</strong></p>
            <p>The correct answer was:</p><p>Minimize my average distance from the target</p> </div>`; 
    }
    else if (user_answer2!="Minimize my average distance from the target" && streak==false)
    {
        instructpage_after4=`<div class='instructions4'>
            <p><strong>You were incorrect!</strong></p>
            <p>The correct answer was:</p><p>Minimize my average distance from the target</p> </div>`; 
    }

    }  
    }

    p.inst.instruct_after4 = {
        type: "instructions",
        pages: function () {
            return [instructpage_after4];
        },
        show_clickable_nav: true,
        allow_backward: true
    };


    p.Qs.flowComp = {
        type: 'survey-multi-choice',
        preamble: `<div class='instructions'>
        <p><strong>Welcome!</strong></p>
        <p>Before you begin this survey, please note the following:</p>
        <p>Unlike some surveys on Prolific, we NEVER deny payment based on performance
        or answers to questions. We simply ask that you try your best, and answer 
        each question as honestly and accurately as possible. No matter what answers you give or how
        you perform, you will be fully compensated. That is a guarantee.</p>
        <p>To ensure that you understand this information, please answer the following question.</p></div>`,
        questions: [
            {prompt: "Will you receive full payment regardless of how you perform and answer questions?", name: 'attnChk', required: true, 
            options: ["Yes", "No"]}, 
        ]
    };

    p.Qs.hole = {
        timeline: [new flowQs('hole', 'Hole in One'), new enjoyQs('hole', 'Hole in One')]
    };

    p.Qs.sling = {
        timeline: [new flowQs('sling', `${gameName}`), new enjoyQs('sling', `${gameName}`)]
    };

    p.Qs.demographics = (function() {
        var gender = {
            type: 'html-button-response',
            stimulus: '<p>Gender:</p>',
            choices: ['Male', 'Female', 'Other'],
        };
        var age = {
            type: 'survey-text',
            questions: [{prompt: "Age:", name: "age"}],
        }; 
        var ethnicity = {
            type: 'html-button-response',
            stimulus: '<p>Ethnicity:</p>',
            choices: ['White / Caucasian', 'Black / African American','Asian / Pacific Islander', 'Hispanic', 'Native American', 'Other'],
        };
        var english = {
            type: 'html-button-response',
            stimulus: '<p>Is English your native language?:</p>',
            choices: ['Yes', 'No'],
        };  
        var finalWord = {
            type: 'survey-text',
            questions: [{prompt: "Questions? Comments? Complaints? Provide your feedback here!", rows: 10, columns: 100, name: "finalWord"}],
        }; 
        var email = {
            type: 'survey-text',
            preamble: '<p>Please type your Prolific ID in the space below.</p><p><b>After submitting, wait to be redirect to Prolific to receive payment.</b></p>',
            questions: [{prompt: "", placeholder: "Prolific ID", name: "PID", columns: 50, required: true}],
            button_label: ['CLICK HERE TO FINISH'], 
        };
        var demos = {
            timeline: [gender, age, ethnicity, english, finalWord, email]
        };

        return demos;
    }());
    return p;
}


function SecondExperiment(mytargetBig, mystreak, ismoney)
{

    var p = {};
    p.consent = {
        type: "external-html",
        url: "./html/consent.html",
        cont_btn: "advance",
    };
    // save condition, date, and time
    var targetBig = mytargetBig;
    var streak = mystreak;
    const gameName = (streak) ? 'Streak-o-Rama' : 'Close Call';
    if (streak) {
        var inst = `<div class='instructions'>

        <p><strong>${gameName}</strong>. The goal of ${gameName} is to maximize the length of your average hit streak. For each consecutive hit, your current "hit streak" will increase by 1. Try your best to make your hit streaks as long as possible! 
        Follow the instructions in the game area, then play ${gameName}. We'll let you know when time is up.</p></div>`
    } else {
        var inst = `<div class='instructions'>

        <p><strong>${gameName}</strong>. The goal of ${gameName} is to minimize your average distance from the target. After each shot, your distance from the target will be computed. Try your best to get as close to the target as possible! 
        Follow the instructions in the game area, then play ${gameName}. We'll let you know when time is up.</p></div>`
    }

    jsPsych.data.addProperties({
        targetBig2: targetBig,
        streak2: streak,
        ismoney2: ismoney,
        date2: new Date(),
        PROLIFIC_PID: jsPsych.data.getURLVariable('subject'),
    });

   /*
    *
    *  INSTRUCTIONS
    *
    */
        
    p.inst = {}

    // instruction pages
    var block1page1 = `<div class='instructions'>

    <p><b>Welcome to Ball Games!</b></p>

    <p>For the next 5 to 8 minutes, you'll be helping us 
    answer the following question: "What makes some games more immersive and engaging than others?"</p>

    <p>Specifically, you'll play three different ball games and provide feedback about each one. 
    By playing games and providing feedback, you'll help us understand how to design games 
    that are as immersive and engaging as possible.</div>`; 

    var block2page1 = `<div class='instructions1a'>
    <p><strong>Game #1: Hole in One</strong></p>

    <p>The first ball game you'll play is called Hole in One!</p>

    <p>After you finish Hole in One, you'll answer questions about your experience.</p>

    <p>When you're ready to play, press "Next."</p></div>`; 

    var block3page1 = `<div class='instructions'>

    <p>Thank you! Next, you'll spend a few minutes playing two more games. After each game, 
    you'll answer some questions about your experience. When you're ready, 
    press "Next" to continue.</p></div>`; 

    var block4page1 = `<div class='instructions'>

    <p>Thank you! Next, you'll complete a brief demographics survey. When you're ready, 
    press "Next" to continue.</p></div>`; 

    // combine pages into blocks
    p.inst.block1 = {
        type: "instructions",
        pages: [block1page1],
        show_clickable_nav: true,
        allow_backward: true
    };

    p.inst.block2 = {
        type: "instructions",
        pages: [block2page1],
        show_clickable_nav: true,
        allow_backward: true
    };

    p.inst.block3 = {
        type: "instructions",
        pages: [block3page1],
        show_clickable_nav: true,
        allow_backward: true
    };

    p.inst.block4 = {
        type: "instructions",
        pages: [block4page1],
        show_clickable_nav: true,
        allow_backward: true
    };

   /*
    *
    *  TASKS
    *
    */

    p.tasks = {};

    // parameterize "Hole in One"
    p.tasks.holeInOne = {
        type: 'hole-in-one-game',
        stimulus: holeInOne.run,
        total_shots: 10,  
        canvas_size: [475, 900],
        ball_color: 'white',
        ball_size: 10,
        ball_xPos: .13,
        ball_yPos: .5,
        wall_width: 75,
        wall_color: '#797D7F',
        wall_xPos: .9,
        hole_size: 75,
        friction: .02,
        tension: .03,
        prompt: `<div class='instructions'>

        <p><strong>Hole in One</strong>. The goal of Hole in One is to shoot the ball through the hole. 
        Follow the instructions in the game area, then play Hole in One. 
        We'll let you know when time is up.</p></div>`
    };

    // parameterize "Target Practice"
    p.tasks.slingshotGame = {
        type: 'slingshot2-game',
        stimulus: slingshot2.run,
        total_shots: 25,  
        canvas_size: [475, 900],
        ball_color: 'white',
        ball_size: 10,
        ball_xPos: .13,
        ball_yPos: .5,
        target_color: 'red',
        target_color_hit: 'green',
        target_size: targetBig == 1 ? 45 : 10,
        game_type: streak,
        money: ismoney,
        target_xPos: .9,
        target_yPos: [.2, .4, .5, .6, .8],
        friction: .02,
        tension: .03,
        prompt: inst,
    };


    // scales
    var zeroToExtremely = ['0<br>A little', '1', '2', '3', '4<br>Very', '5', '6', '7', '8<br>Completely'];
    var zeroToALot = ['0<br>A little', '1', '2', '3', '4', '5', '6', '7', '8<br>A lot'];

    // constructor functions
    var flowQs = function(shortName, fullName) {
        this.type = 'survey-likert';
        this.preamble = `<div class='qInfo'>

        <p><strong>Thank you for playing ` + fullName + `!</strong></p>

        <p>During ` + fullName + `, to what extent did you feel immersed and engaged in what you were doing?<br>
        Report how immersed and engaged you felt by answering the following questions.</p></div>`;
        this.questions = [
            {prompt: 'During ' + fullName + ', how <b>absorbed</b> did you feel in what you were doing?',
            name: 'F_absorbed_' + shortName,
            labels: ['0<br>A little<br>absorbed', '1', '2', '3', '4<br>Quite<br>absorbed', '5', '6', '7', '8<br>Completely<br>absorbed']},
            {prompt: 'During ' + fullName + ', how <b>immersed</b> did you feel in what you were doing?',
            name: 'F_immersed_' + shortName,
            labels: ['0<br>A little<br>immersed', '1', '2', '3', '4<br>Quite<br>immersed', '5', '6', '7', '8<br>Completely<br>immersed']},
            {prompt: 'During ' + fullName + ', how <b>engaged</b> did you feel in what you were doing?',
            name: 'F_engaged_' + shortName,
            labels: ['0<br>A little<br>engaged', '1', '2', '3', '4<br>Quite<br>engaged', '5', '6', '7', '8<br>Completely<br>engaged']},
            {prompt: 'During ' + fullName + ', how <b>engrossed</b> did you feel in what you were doing?',
            name: 'F_engrossed_' + shortName,
            labels: ['0<br>A little<br>engrossed', '1', '2', '3', '4<br>Quite<br>engrossed', '5', '6', '7', '8<br>Completely<br>engrossed']},
        ];
        this.randomize_question_order = false;
        this.scale_width = 600;
    };

    var enjoyQs = function(shortName, fullName) {
        this.type = 'survey-likert';
        this.preamble = `<div class='qInfo'>

        <p>Below are a few more questions about ` + fullName + `.</p><p>Instead of asking about immersion and engagement, 
        these questions ask about <strong>enjoyment</strong>.<br>Report how much you <strong>enjoyed</strong> 
        playing ` + fullName + ` by answering the following questions.</p></div>`;
        this.questions = [
            {prompt: 'How much did you <b>enjoy</b> playing ' + fullName + '?',
            name: 'E_enjoyable_' + shortName,
            labels: ['0<br>A little', '1', '2', '3', '4<br>Moderately', '5', '6', '7', '8<br>A lot']},
            {prompt: 'How much did you <b>like</b> playing ' + fullName + '?',
            name: 'E_like_' + shortName,
            labels: ['0<br>A little', '1', '2', '3', '4<br>Moderately', '5', '6', '7', '8<br>A lot']},
            {prompt: 'How much did you <b>dislike</b> playing ' + fullName + '?',
            name: 'E_dislike_' + shortName,
            labels: ['0<br>A little', '1', '2', '3', '4<br>Moderately', '5', '6', '7', '8<br>A lot']},
            {prompt: 'How much <b>fun</b> did you have playing ' + fullName + '?',
            name: 'E_fun_' + shortName,
            labels: ['0<br>A little', '1', '2', '3', '4<br>Moderately', '5', '6', '7', '8<br>A lot']},
            {prompt: 'How <b>entertaining</b> was ' + fullName + '?',
            name: 'E_entertaining_' + shortName,
            labels: ['0<br>A little', '1', '2', '3', '4<br>Moderately', '5', '6', '7', '8<br>Extremely']},
        ];
        this.randomize_question_order = false;
        this.scale_width = 600;
    };

    p.Qs = {};


    if (streak==true)
        {
            if (targetBig==true)
                {
                var instructpage1a=`<div class='instructions1a'>
                    <p><strong>Game #3: ${gameName}</strong></p>
                    <p>The next ball game you'll play is called ${gameName}!</p>
                    <p>The goal of ${gameName} is to hit the target (the red circle) as many times in a row as possible with the white ball.</p>
                    <p><img src="images/bigtargetshoot.gif" alt="Game Demonstration" style="width: 500px; height: auto;"></img></p>
                    </div>`;
                var instructpage2;
                if (ismoney==false)
                    {
                        instructpage2=`<div class='instructions2'>
    
                        <p>For each consecutive hit, your current "hit streak" will increase by 1.<br> 
    
                        If you miss, your current "hit streak" will go back to 0.</p>
    
                        <p>At the end of the game, the average length of your hit streaks will be computed.<br>
    
                        Success entails maximizing the length of your average hit streak.</p>               
    
                        </div>`;
                    }
                    else
                    {
                        instructpage2=`<div class='instructions2'>
    
                        <p><strong>Bonus Opportunity!</strong></p>
    
                        <p>The 10 players with the longest average "hit streak" will each receive $20!</p>
    
                        <p>For each consecutive hit, your current "hit streak" will increase by 1.<br> 
    
                        If you miss, your current "hit streak" will go back to 0.</p>
    
                        <p>At the end of the game, the average length of your hit streaks will be computed.<br>
    
                        If your average hit streak is in the top 10, you'll receive a $20 bonus.</p>
    
                        </div>`;
                    }     
                }
            else
                {
                var instructpage1a=`<div class='instructions1a'>
                    <p><strong>Game #3: ${gameName}</strong></p>
                    <p>The next ball game you'll play is called ${gameName}!</p>
                    <p>The goal of ${gameName} is to hit the target (the red circle) as many times in a row as possible with the white ball.</p>
                    <p><img src="images/smalltargetshoot.gif" alt="Game Demonstration" style="width: 500px; height: auto;"></img></p>
                    </div>`;
                var instructpage2;
                if (ismoney==false)
                {
                    instructpage2=`<div class='instructions2'>

                    <p>For each consecutive hit, your current "hit streak" will increase by 1.<br> 

                    If you miss, your current "hit streak" will go back to 0.</p>

                    <p>At the end of the game, the average length of your hit streaks will be computed.<br>

                    Success entails maximizing the length of your average hit streak.</p>               

                    </div>`;
                }
                else
                {
                    instructpage2=`<div class='instructions2'>

                    <p><strong>Bonus Opportunity!</strong></p>

                    <p>The 10 players with the longest average "hit streak" will each receive $20!</p>

                    <p>For each consecutive hit, your current "hit streak" will increase by 1.<br> 

                    If you miss, your current "hit streak" will go back to 0.</p>

                    <p>At the end of the game, the average length of your hit streaks will be computed.<br>

                    If your average hit streak is in the top 10, you'll receive a $20 bonus.</p>

                    </div>`;
                }            
                }
            var instructpage4=`<div class='instructions4'>
                <p>Aim the ball towards the target and try your best to make your hit streaks as long as possible!</p></div>`; 
        }
    else
        {
            if (targetBig==true)
                {
                var instructpage1a=`<div class='instructions1a'>
                <p><strong>Game #3: ${gameName}</strong></p>
                <p>The next ball game you'll play is called ${gameName}!</p>
                <p>The goal of ${gameName} is to shoot the white ball as close to the target (the red circle) as possible.</p>
                <p><img src="images/bigtargetshoot.gif" alt="Game Demonstration" style="width: 500px; height: auto;"></img></p>
                </div>`;
                var instructpage2;
                if (ismoney==false)
                {
                    instructpage2=`<div class='instructions2'>
                    <p>After each shot, your distance from the target will be computed.<br>
                    Hitting the target corresponds to a distance of 0.</p>
                    <p>At the end of the game, your average distance from the target will be computed.<br>
                    Success entails minimizing your average distance from the target.</p>
                    </div>`;
                }
                else
                {
                    instructpage2=`<div class='instructions2'>

                    <p><strong>Bonus Opportunity!</strong></p>

                    <p>The 10 players with the closest average distance from the target will each receive $20!</p>

                    <p>After each shot, your distance from the target will be computed.<br>

                    Hitting the target corresponds to a distance of 0.</p>

                    <p>At the end of the game, your average distance from the target will be computed.<br>

                    If you're one of the top 10 closest shooters, you'll receive a $20 bonus.</p>

                    </div>`;
                }
                }
            else
                {
                var instructpage1a=`<div class='instructions1a'>
                <p><strong>Game #3: ${gameName}</strong></p>
                <p>The next ball game you'll play is called ${gameName}!</p>
                <p>The goal of ${gameName} is to shoot the white ball as close to the target (the red circle) as possible.</p>
                <p><img src="images/smalltargetshoot.gif" alt="Game Demonstration" style="width: 500px; height: auto;"></img></p>
                </div>`;  
                var instructpage2;
                if (ismoney==false)
                {
                    instructpage2=`<div class='instructions2'>
                    <p>After each shot, your distance from the target will be computed.<br>
                    Hitting the target corresponds to a distance of 0.</p>
                    <p>At the end of the game, your average distance from the target will be computed.<br>
                    Success entails minimizing your average distance from the target.</p>
                    </div>`;
                }
                else
                {
                    instructpage2=`<div class='instructions2'>

                    <p><strong>Bonus Opportunity!</strong></p>

                    <p>The 10 players with the closest average distance from the target will each receive $20!</p>

                    <p>After each shot, your distance from the target will be computed.<br>

                    Hitting the target corresponds to a distance of 0.</p>

                    <p>At the end of the game, your average distance from the target will be computed.<br>

                    If you're one of the top 10 closest shooters, you'll receive a $20 bonus.</p>

                    </div>`;
                }
                }
            var instructpage4=`<div class='instructions4'>
            <p>Aim the ball towards the target and try your best to get as close to the target as possible!</p></div>`; 
        }
    
    var instructpage_before2;
    var instructpage_after4;
    p.inst.instruct1 = {
        type: "instructions",
        pages: [instructpage1a],
        show_clickable_nav: true,
        allow_backward: true
    };



    p.Qs.goalquestion = {
        type: 'survey-multi-choice',
        preamble: `<div class='question'>
        <p>To ensure that you understand this information, please answer the following question.</p></div>`,
        questions: [
            {prompt: `What is the goal of ${gameName}?`, name: 'rwrdChk1', required: true, 
            options: ["To hit the target as many times in a row as possible", "To make the ball reach the greatest height", "To shoot the ball as close to the target as possible", "To hit the target at least once per 5 attempts", "To avoid hitting the target"]}, 
        ],
        on_finish: function(data){
            user_answer1=JSON.parse(data.responses).rwrdChk1;

    if (user_answer1=="To hit the target as many times in a row as possible" && streak==true)
    {
        instructpage_before2=`<div class='instructions_before2'>
        <p><strong>You were correct!</strong></p>
        <p>The correct answer was:</p><p>To hit the target as many times in a row as possible </p> 
        </div>`;
    }
    else if (user_answer1!="To hit the target as many times in a row as possible" && streak==true)
    {
        instructpage_before2=`<div class='instructions_before2'>
        <p><strong>You were incorrect!</strong></p>
        <p>The correct answer was:</p><p>To hit the target as many times in a row as possible </p> 
        </div>`;
    }
    else if (user_answer1=="To shoot the ball as close to the target as possible" && streak==false)
    {
        instructpage_before2=`<div class='instructions_before2'>
        <p><strong>You were correct!</strong></p>
        <p>The correct answer was:</p><p>To shoot the ball as close to the target as possible </p> 
        </div>`;
    }
    else if (user_answer1!="To shoot the ball as close to the target as possible" && streak==false)
    {
        instructpage_before2=`<div class='instructions_before2'>
        <p><strong>You were incorrect!</strong></p>
        <p>The correct answer was:</p><p>To shoot the ball as close to the target as possible </p> 
        </div>`;
    }

    }
    }

    p.inst.instruct234 = {
        type: "instructions",
        pages: function () {
            return [instructpage_before2, instructpage2, instructpage4];
        },
        show_clickable_nav: true,
        allow_backward: true
    };
    if (ismoney==false)
    {
        rewardprompt=`In ${gameName}, what must you do to succeed?`;
    }
    else
    {
        rewardprompt=`In ${gameName}, what must you do to win $20?`
    }
    p.Qs.rewardquestion = {
        type: 'survey-multi-choice',
        preamble: `<div class='question'>
        <p>To ensure that you understand this information, please answer the following question.</p></div>`,
        questions: [
            {prompt: rewardprompt, name: 'rwrdChk2', required: true, 
            options: ["Maximize my total hits", "Maximize the length of my average hit streak", "Minimize my total hits", "Minimize my average distance from the target", "Maximize the number of times I have 3 consecutive misses", "Maximize the number of times I get 3 consecutive hits"]}, 
        ],
        on_finish: function(data){
            user_answer2=JSON.parse(data.responses).rwrdChk2;
    

    if (user_answer2=="Maximize the length of my average hit streak" && streak==true)
    {
        instructpage_after4=`<div class='instructions4'>
            <p><strong>You were correct!</strong></p>
            <p>The correct answer was:</p><p>Maximize the length of my average hit streak</p> </div>`; 
    }
    else if (user_answer2!="Maximize the length of my average hit streak" && streak==true)
    {
        instructpage_after4=`<div class='instructions4'>
            <p><strong>You were incorrect!</strong></p>
            <p>The correct answer was:</p><p>Maximize the length of my average hit streak</p> </div>`; 
    }
    else if (user_answer2=="Minimize my average distance from the target" && streak==false)
    {
        instructpage_after4=`<div class='instructions4'>
            <p><strong>You were correct!</strong></p>
            <p>The correct answer was:</p><p>Minimize my average distance from the target</p> </div>`; 
    }
    else if (user_answer2!="Minimize my average distance from the target" && streak==false)
    {
        instructpage_after4=`<div class='instructions4'>
            <p><strong>You were incorrect!</strong></p>
            <p>The correct answer was:</p><p>Minimize my average distance from the target</p> </div>`; 
    }

    }  
    }

    p.inst.instruct_after4 = {
        type: "instructions",
        pages: function () {
            return [instructpage_after4];
        },
        show_clickable_nav: true,
        allow_backward: true
    };


    p.Qs.flowComp = {
        type: 'survey-multi-choice',
        preamble: `<div class='instructions'>
        <p><strong>Welcome!</strong></p>
        <p>Before you begin this survey, please note the following:</p>
        <p>Unlike some surveys on Prolific, we NEVER deny payment based on performance
        or answers to questions. We simply ask that you try your best, and answer 
        each question as honestly and accurately as possible. No matter what answers you give or how
        you perform, you will be fully compensated. That is a guarantee.</p>
        <p>To ensure that you understand this information, please answer the following question.</p></div>`,
        questions: [
            {prompt: "Will you receive full payment regardless of how you perform and answer questions?", name: 'attnChk', required: true, 
            options: ["Yes", "No"]}, 
        ]
    };

    p.Qs.hole = {
        timeline: [new flowQs('hole', 'Hole in One'), new enjoyQs('hole', 'Hole in One')]
    };

    p.Qs.sling = {
        timeline: [new flowQs('sling', `${gameName}`), new enjoyQs('sling', `${gameName}`)]
    };

    p.Qs.demographics = (function() {
        var gender = {
            type: 'html-button-response',
            stimulus: '<p>Gender:</p>',
            choices: ['Male', 'Female', 'Other'],
        };
        var age = {
            type: 'survey-text',
            questions: [{prompt: "Age:", name: "age"}],
        }; 
        var ethnicity = {
            type: 'html-button-response',
            stimulus: '<p>Ethnicity:</p>',
            choices: ['White / Caucasian', 'Black / African American','Asian / Pacific Islander', 'Hispanic', 'Native American', 'Other'],
        };
        var english = {
            type: 'html-button-response',
            stimulus: '<p>Is English your native language?:</p>',
            choices: ['Yes', 'No'],
        };  
        var finalWord = {
            type: 'survey-text',
            questions: [{prompt: "Questions? Comments? Complaints? Provide your feedback here!", rows: 10, columns: 100, name: "finalWord"}],
        }; 
        var email = {
            type: 'survey-text',
            preamble: '<p>Please type your Prolific ID in the space below.</p><p><b>After submitting, wait to be redirect to Prolific to receive payment.</b></p>',
            questions: [{prompt: "", placeholder: "Prolific ID", name: "PID", columns: 50, required: true}],
            button_label: ['CLICK HERE TO FINISH'], 
        };
        var demos = {
            timeline: [gender, age, ethnicity, english, finalWord, email]
        };

        return demos;
    }());
    return p;
}


var exp1=FirstExperiment(mytargetBig=false, mystreak=streak1, ismoney=ismoney1);
var exp2=SecondExperiment(mytargetBig=false, mystreak=streak2, ismoney=ismoney2);

var timeline = [
    exp1.consent,

    exp1.inst.block1,
    exp1.inst.block2,
    exp1.tasks.holeInOne,

    exp1.Qs.hole,

    exp1.inst.block3,



    exp1.inst.instruct1,
    exp1.Qs.goalquestion,
    exp1.inst.instruct234,
    exp1.Qs.rewardquestion,
    exp1.inst.instruct_after4,
    exp1.tasks.slingshotGame,

    exp1.Qs.sling,

    exp2.inst.instruct1,
    exp2.Qs.goalquestion,
    exp2.inst.instruct234,
    exp2.Qs.rewardquestion,
    exp2.inst.instruct_after4,
    exp2.tasks.slingshotGame,

    exp2.Qs.sling,
    
    exp1.inst.block4,
    exp1.Qs.demographics,
];

jsPsych.init({
    timeline: timeline,
    on_finish: function() {
        fetch("https://pipe.jspsych.org/api/data/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
            },
            body: JSON.stringify({
              experimentID: "HVaRwRG3aAzy",
              filename: myfilename,
              data: jsPsych.data.get().csv(),
            }),
          });
        document.body.innerHTML=`
        <div align='center' style="margin: 10%><p>Thank you!</p><p>Please wait to be redirected to Prolific.</p></div>`;
        setTimeout(()=>{location.href = "https://app.prolific.co/submissions/complete?cc=C1NORUAI"}, 3000);
    },
});
