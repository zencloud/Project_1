/// --- Core App Functions --- ///

// TEMPORARY AJAX REFERENCE
function call_data() {
    $.ajax({
        url: "https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi?q=get%3Anew7-!1900,2018-!0,5-!0,10-!0-!Any-!Any-!Any-!gt100-!{downloadable}&t=ns&cl=all&st=adv&ob=Relevance&p=1&sa=and",
        headers: {
            'X-RapidAPI-Host': 'unogs-unogs-v1.p.rapidapi.com',
            'X-RapidAPI-Key': '4d121bd4f5mshafce35864f40836p1d896cjsn949371756abd'
        },

        success: function (response) {
            console.log(response);
        }
    });
}


// Initialize App, first run
function app_initialize() {

    // Check local storage
    let profileCheck = localStorage.getItem('app-favflix');

    // If no profile found
    if (profileCheck === null) {

        //  Profile Name: Create suibmit input listener
        $('#btn-submit-profile').on('click', function () {
            app_profile_submit_name();
        });

        // Profile Icon: Create submit button listener
        $('#btn-submit-profile-icon').on('click', function () {
            app_profile_submit_icon();
        });

        // Profile Icons: Create select icon listener
        $('#app-stage-profile-icon img').on('click', function () {

            // Unselect other icons
            $('#app-stage-profile-icon img').each(function () {
                $(this).removeClass('app-profile-icon-selected');
            });

            // Select clicked icon
            $(this).addClass('app-profile-icon-selected');

            // Update selected value
            appData.tempProfileSelected = $(this).attr('data-id');
        });


        // Profile Name: Form render. Start of profile creation staging.
        $('#app-stage-profile').fadeIn('slow');
    }

    // Profile Found. Load Data
    else {

        // Get saved profile data and store local
        app_data_profile_get_local();

        // Welcome Name: Update dom
        app_render_welcome_name();

        // Render Navigation
        app_render_nav_favorites();

        // Staging Logo: Hide from dom
        $('#app-stage-logo').remove();
        $('#app-stage-content').fadeIn('fast');
    }
}


// Profile Name: Validate input, store and update profile name.
function app_profile_submit_name() {

    // Validate w/ early exit
    let inputValue = $('#input-field-profile-name').val();
    if (inputValue === '') {

        $('#input-field-profile-name').css('border', '2px solid red');
        //$('#app-input-warning').fadeIn('fast');
        return null;
    }

    // Data has been validated
    if (inputValue !== '') {

        // Save profile profile name and generate unique ID
        appProfile.profileName = inputValue;
        appProfile.profileID = Math.random().toString(36).substr(2, 9);

        // Save to local storage
        app_data_profile_store_local();

        // Update profile name display
        app_render_welcome_name();

        app_render_nav_favorites();

        // Fade out and trigger next stage
        $('#app-stage-profile').fadeOut('fast', function () {
            $('#app-stage-profile-icon').fadeIn('fast');
        });

    }
}

// Add new category
function app_category_add_new() {

    // Validate w/ early exit
    let inputValue = $('#input-field-category-name').val();
    if (inputValue === '') {

        $('#input-field-category-name').css('border', '2px solid red');
        //$('#app-input-warning').fadeIn('fast');
        return null;
    }

    // Data has been validated
    if (inputValue !== '') {

        // Setup new category object with input value and push to local array
        let catObject = { catName: inputValue, catLibrary: [] };
        appProfile.favLibrary.push(catObject);

        // Store profile data to local storage
        app_data_profile_store_local();
        
        // Render new category addition
        app_render_nav_add_append();
        
        // Close the modal and clear from dome
        $.modal.close();
        $('#modal-add-category').remove();
    }
}

// Player Icon: Submit change
function app_profile_submit_icon() {

    appProfile.profileIcon = appData.tempProfileSelected;
    app_render_profile_icon();
    app_data_profile_store_local();

    // Fade out and trigger next stage
    $('#app-stage-logo').fadeOut('fast');
    $('#app-stage-profile-icon').fadeOut('fast', function () {
        $('#app-stage-content').fadeIn('fast');
    });
}


// ------ Render Utilities ------ //


// Render Favorites
function app_render_favorites() {

    let myHTML = `
    <div class="card app-content-item">
        <img class="card-img-top" src="http://art-2.nflximg.net/63fac/79c52ccb0931cc50f51fd8922ecaef551d263fac.jpg" alt="Card image cap">
        <div class="card-body app-content-item-body">
            <div class="d-flex justify-content-between">
                <div>
                    <p>Left Side</p>
                    <p>Left Side</p>
                </div>
                <div class="d-flex align-items-center">
                    <p>Right Side</p>
                </div>
            </div>
        </div>
    </div>`;

    $('#app-content').empty();
    $('#app-content').append(myHTML);
    $('#app-content').append(myHTML);
    $('#app-content').append(myHTML);
    $('#app-content').append(myHTML);
    $('#app-content').append(myHTML);
}


// Render Favorites Categories
function app_render_nav_favorites() {

    // Clear Navigation
    $('#app-nav-content').empty();

    appProfile.favLibrary.forEach(function (value, index) {
        let myHTML = `
            <div class="app-nav-box">
                <p><i class="fas fa-bookmark">&nbsp;</i><a href="#" onclick="app_render_favorites()">${appProfile.favLibrary[index].catName}</a></p>
            </div>
            <hr>`;
        $('#app-nav-content').append(myHTML);
    });
}

// Render Favorites Categories
function app_render_nav_add_append() {

    let index = appProfile.favLibrary.length-1;
    let myHTML = `
        <div class="app-nav-box animate-puff-in">
            <p><i class="fas fa-bookmark"></i><a href="#" onclick="app_render_favorites()">${appProfile.favLibrary[index].catName}</a></p>
        </div>
        <hr>`;
    $('#app-nav-content').append(myHTML);
}

// Render: Update welcome name
function app_render_welcome_name() {
    $('#app-welcome-name').text(appProfile.profileName);
}

// Render: Update welcome profile icon
function app_render_profile_icon() {
    $('#app-welcome-img').attr('src', 'app/imgs/profile_icons/' + appData.iconLibrary[appProfile.profileIcon]);
}


// --- Data Management --- //


// Store Local Data
function app_data_profile_store_local() {
    localStorage.setItem(appData.appPrefix, JSON.stringify(appProfile));
}

// Store Local Data
function app_data_profile_get_local() {
    appProfile = JSON.parse(localStorage.getItem(appData.appPrefix));
}


// ---- DEBUG ---- //


function app_debug_clear_data() {

    event.preventDefault();
    localStorage.removeItem(appData.appPrefix);
    location.reload();
}
