$(document).ready(function () {
  const login_User_Form = document.querySelector('#login-user-form');
  const register_user_form = document.querySelector('#register-user-form');
  let username_Input = document.querySelector('#userName');
  let password_Input = document.querySelector('#password');
  const btn_close_msg_succ_register = document.querySelector(".btn-close");
  let username_value;
  let password_value;
  let userFromLocalStorage;
  let newUser;
  let arrStore = [];
  function User(username, password) {
    this.username = username;
    this.password = password;
  }

  $(".message-warning").hide()
  $(".wrong-password-msg").hide();

  //register_user_form.addEventListener('submit', register_Fun);
  login_User_Form.addEventListener('submit', login_Fun);

  // register function
  function register_Fun(e) {
    e.preventDefault();
    username_value = username_Input.value;
    password_value = password_Input.value;
    newUser = new User(username_value, password_value);
    arrStore.push(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    $('.confirm-registeredModalMessage').show();
    btn_close_msg_succ_register.addEventListener('click', closeConfirmMsgModal)
    register_user_form.reset();
  }

  $('.confirm-registeredModalMessage').hide()

  // close Confirm Msg Modal
  function closeConfirmMsgModal() {
    $('.confirm-registeredModalMessage').hide()
    window.location = "./quetions.html";
  }
  // show And Hide Msg Must Register
  function showAndHideMsg_MustRegister() {
    $(".message-warning").show();
    setTimeout(function () {
      $(".message-warning").hide();
    }, 5000);
  }
  // LogIn Function
  function login_Fun(e) {
    e.preventDefault();

    username_value = username_Input.value;
    password_value = password_Input.value;
    userFromLocalStorage = JSON.parse(localStorage.getItem('currentUser'));

    if (!userFromLocalStorage) {
      showAndHideMsg_MustRegister();
    }
    else if (userFromLocalStorage.username !== username_value && userFromLocalStorage.password !== password_value) {
      showAndHideMsg_MustRegister();
    }
    else if (userFromLocalStorage.password !== password_value) {
      $(".wrong-password-msg").show();
      setTimeout(function () {
        $(".wrong-password-msg").hide();
      }, 5000);
    }
    else {
      login_User_Form.reset();
      window.location = "./quetions.html";
    }
  }
});