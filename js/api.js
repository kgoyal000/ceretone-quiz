// API integration for the hearing test form
const API_URL = 'http://localhost:5050/api/submit-test';

// Function to collect form data and format it for the API
function collectFormData() {
    // Demographics data - only collect email, which is the only input field in the form
    const demographics = {};
    
    // Only add email if provided in the form
    const email = $('.step[data-value="82"] .email input').val();
    if (email) {
        demographics.email = email;
    }

    // Helper function to convert slider value to the proper stepped scale
    // Different tests have different step counts (9, 12, or 17 steps)
    function calculateSteppedValue(sliderValue, totalSteps) {
        // Convert value from 0-1 to appropriate step count, then scale to 0-85
        const step = Math.round(sliderValue * (totalSteps - 1));
        return step * (85 / (totalSteps - 1));
    }

    // Puretone data - collect actual values from the audio tests with proper step scaling
    const puretone = {
        answers: {
            left: {
                // Frequency tests - 17 steps (0-85)
                "1000": { threshold: calculateSteppedValue($('.step[data-value="74"] .audio__bar input').val(), 17) },
                "2000": { threshold: calculateSteppedValue($('.step[data-value="77"] .audio__bar input').val(), 17) },
                "4000": { threshold: calculateSteppedValue($('.step[data-value="80"] .audio__bar input').val(), 17) },
                "6000": { threshold: calculateSteppedValue($('.step[data-value="83"] .audio__bar input').val(), 17) },
                "rainbow": {
                    // MCL test - 9 steps (0-85)
                    mcl: calculateSteppedValue($('.step[data-value="69"] .audio__bar input').val(), 9),
                    // Speech test - 12 steps (0-85)
                    threshold: calculateSteppedValue($('.step[data-value="72"] .audio__bar input').val(), 12)
                }
            },
            right: {
                // Frequency tests - 17 steps (0-85)
                "1000": { threshold: calculateSteppedValue($('.step[data-value="56"] .audio__bar input').val(), 17) },
                "2000": { threshold: calculateSteppedValue($('.step[data-value="59"] .audio__bar input').val(), 17) },
                "4000": { threshold: calculateSteppedValue($('.step[data-value="62"] .audio__bar input').val(), 17) },
                "6000": { threshold: calculateSteppedValue($('.step[data-value="65"] .audio__bar input').val(), 17) },
                "rainbow": {
                    // MCL test - 9 steps (0-85)
                    mcl: calculateSteppedValue($('.step[data-value="51"] .audio__bar input').val(), 9),
                    // Speech test - 12 steps (0-85)
                    threshold: calculateSteppedValue($('.step[data-value="53"] .audio__bar input').val(), 12)
                }
            }
        }
    };

    // Questions data - collect from the questionnaire
    const questions = {
        answers: []
    };

    // Add Q1 - How would you describe your hearing?
    const q1Answer = $('.step[data-value="15"] .plates__ .current').text().trim();
    if (q1Answer) {
        questions.answers.push({
            question: {
                id: "Q1",
                text: "questionnaire.questions.how-would-you-describe-your-hearing",
                textValue: "How would you describe your hearing?",
                textValueLocalized: "How would you describe your hearing?"
            },
            answer: {
                id: "Q1A" + ($('.step[data-value="15"] .plates__ .current').index() + 1),
                text: "questionnaire.answers." + q1Answer.toLowerCase().replace(/\s+/g, '-'),
                textValue: q1Answer,
                textValueLocalized: q1Answer
            }
        });
    }

    // Add Q6 - Do you find it hard to have a conversation on the phone?
    const q6Answer = $('.step[data-value="17"] .plates__ .current').text().trim();
    if (q6Answer) {
        questions.answers.push({
            question: {
                id: "Q6",
                text: "questionnaire.questions.in-conversations-in-a-quiet-environment",
                textValue: "Do you find it hard to have a conversation on the phone?",
                textValueLocalized: "Do you find it hard to have a conversation on the phone?"
            },
            answer: {
                id: "Q6A" + ($('.step[data-value="17"] .plates__ .current').index() + 1),
                text: "questionnaire.answers." + q6Answer.toLowerCase().replace(/\s+/g, '-'),
                textValue: q6Answer,
                textValueLocalized: q6Answer
            }
        });
    }

    // Add Q14 - Do you feel like one ear hears significantly better than the other one?
    const q14Answer = $('.step[data-value="27"] .plates__ .current').text().trim();
    if (q14Answer) {
        questions.answers.push({
            question: {
                id: "Q14",
                text: "questionnaire.questions.do-you-feel-like-one-ear",
                textValue: "Do you feel like one ear hears significantly better than the other one? If so, which one?",
                textValueLocalized: "Do you feel like one ear hears significantly better than the other one? If so, which one?"
            },
            answer: {
                id: "Q14A" + ($('.step[data-value="27"] .plates__ .current').index() + 1),
                text: "questionnaire.answers." + q14Answer.toLowerCase().replace(/\s+/g, '-'),
                textValue: q14Answer,
                textValueLocalized: q14Answer
            }
        });
    }

    // Add Q15 - Do you find it hard to follow conversations in a noisy environment?
    const q15Answer = $('.step[data-value="32"] .plates__ .current').text().trim();
    if (q15Answer) {
        questions.answers.push({
            question: {
                id: "Q15",
                text: "questionnaire.questions.do-you-find-it-hard-to-follow-conversations",
                textValue: "Do you find it hard to follow conversations in a noisy environment?",
                textValueLocalized: "Do you find it hard to follow conversations in a noisy environment?"
            },
            answer: {
                id: "Q15A" + ($('.step[data-value="32"] .plates__ .current').index() + 1),
                text: "questionnaire.answers." + q15Answer.toLowerCase().replace(/\s+/g, '-'),
                textValue: q15Answer,
                textValueLocalized: q15Answer
            }
        });
    }

    // Combine all data
    return {
        demographics,
        puretone,
        questions
    };
}

// Function to submit the form data to the API
function submitFormData() {
    const formData = collectFormData();
    
    // Show loading state
    $('.step[data-value="82"] .btn>a').addClass('disabled').text('Processing...');
    
    // Get the email address
    const email = $('.step[data-value="82"] .email input').val();
    
    // Add email to demographics if provided
    if (email) {
        formData.demographics.email = email;
    }
    
    // Log the data being sent (for debugging)
    console.log('Sending data to API:', formData);
    
    // Send the data to the API
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('API response:', data);
        
        // Process the results
        if (data.message === 'OK' && data.testResult) {
            displayResults(data.testResult);
        } else {
            console.error('Invalid API response format:', data);
            alert('An error occurred while processing your results. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error submitting form data:', error);
        alert('An error occurred while submitting your data. Please try again.');
    })
    .finally(() => {
        // Reset button state
        $('.step[data-value="82"] .btn>a').removeClass('disabled').text('Get my results');
    });
}

// Function to display the results
function displayResults(testResult) {
    // Extract scores and categories
    const leftScore = testResult.final.score.left;
    const rightScore = testResult.final.score.right;
    const leftCategory = testResult.final.category.left;
    const rightCategory = testResult.final.category.right;
    
    // Update the results page
    
    // Left ear results
    $('.ears__results .elem:first-child .top span').html(`May have <span>${leftCategory.replace('_', ' ')}</span>.`);
    $('.ears__results .elem:first-child .active__bar span').css('width', `${leftScore}%`);
    $('.ears__results .elem:first-child .pointer .inn').css('left', `${leftScore}%`);
    
    // Update the active class for left ear category
    $('.ears__results .elem:first-child .top__info span').removeClass('active');
    if (leftCategory === 'significant_loss') {
        $('.ears__results .elem:first-child .top__info span:nth-child(1)').addClass('active');
        $('.ears__results .elem:first-child .active__bar span').removeClass('green').addClass('red');
    } else if (leftCategory === 'loss') {
        $('.ears__results .elem:first-child .top__info span:nth-child(2)').addClass('active');
        $('.ears__results .elem:first-child .active__bar span').removeClass('green red').addClass('yellow');
    } else {
        $('.ears__results .elem:first-child .top__info span:nth-child(3)').addClass('active');
        $('.ears__results .elem:first-child .active__bar span').removeClass('red yellow').addClass('green');
    }
    
    // Right ear results
    $('.ears__results .elem:last-child .top span').html(`May have <span>${rightCategory.replace('_', ' ')}</span>.`);
    $('.ears__results .elem:last-child .active__bar span').css('width', `${rightScore}%`);
    $('.ears__results .elem:last-child .pointer .inn').css('left', `${rightScore}%`);
    
    // Update the active class for right ear category
    $('.ears__results .elem:last-child .top__info span').removeClass('active');
    if (rightCategory === 'significant_loss') {
        $('.ears__results .elem:last-child .top__info span:nth-child(1)').addClass('active');
        $('.ears__results .elem:last-child .active__bar span').removeClass('green').addClass('red');
    } else if (rightCategory === 'loss') {
        $('.ears__results .elem:last-child .top__info span:nth-child(2)').addClass('active');
        $('.ears__results .elem:last-child .active__bar span').removeClass('green red').addClass('yellow');
    } else {
        $('.ears__results .elem:last-child .top__info span:nth-child(3)').addClass('active');
        $('.ears__results .elem:last-child .active__bar span').removeClass('red yellow').addClass('green');
    }
    
    // Determine overall hearing status
    let overallStatus;
    if (leftCategory === 'good' && rightCategory === 'good') {
        overallStatus = 'good hearing';
    } else if (leftCategory === 'significant_loss' && rightCategory === 'significant_loss') {
        overallStatus = 'significant hearing loss';
    } else if (leftCategory === 'loss' && rightCategory === 'loss') {
        overallStatus = 'hearing loss';
    } else {
        // Mixed results
        if (leftCategory === 'significant_loss' || rightCategory === 'significant_loss') {
            overallStatus = 'some significant hearing loss';
        } else if (leftCategory === 'loss' || rightCategory === 'loss') {
            overallStatus = 'some hearing loss';
        } else {
            overallStatus = 'good hearing';
        }
    }
    
    // Update the overall status
    $('.step.final h2:first-of-type span').text(overallStatus);
    
    // Move to the results page
    if ($('.step.current').next().length) {
        $('.step.current').removeClass("visible");
        setTimeout(function(){
            $('.step.current').css('display', "none");
            $('.step.current').removeClass("current");
            $('.step.final').addClass('current').css("display", "block");
            setTimeout(function(){
                $('.step.current').addClass("visible");
            }, 40);
            let imageId = $('.step.current').attr("data-image");
            $('.top__l').attr("src", "img/prods/" + imageId + "_1.webp");
            $('.top__r').attr("src", "img/prods/" + imageId + "_2.webp");
            $('.top__r2').attr("src", "img/prods/" + imageId + "_3.webp");
            initProgress($('.step.current').attr("data-value"));
        }, 500);
    }
}

// Initialize the API integration when the document is ready
$(document).ready(function() {
    // Add event listener to the "Get my results" button
    $('.step[data-value="82"] .btn>a').on('click', function(e) {
        e.preventDefault();
        
        // Check if the button is disabled
        if (!$(this).hasClass('disabled')) {
            submitFormData();
        }
    });
});
