(function ($) {

  "use strict";
  // init Chocolat light box
  var initChocolat = function () {
    Chocolat(document.querySelectorAll('.image-link'), {
      imageSize: 'contain',
      loop: true,
    })
  }

  document.addEventListener("DOMContentLoaded", function () {

    window.addEventListener('scroll', function () {

      if (window.scrollY > 50) {
        document.getElementById('primary-header').classList.add('fixed-top');
      } else {
        document.getElementById('primary-header').classList.remove('fixed-top');
        // remove padding top from body
        document.body.style.paddingTop = '0';
      }
    });
  });
  // DOMContentLoaded  end



  $(document).ready(function () {

    initChocolat();


    $(".user-items .search-item").click(function () {
      $(".search-box").toggleClass('active');
      $(".search-box .search-input").focus();
    });
    $(".close-button").click(function () {
      $(".search-box").toggleClass('active');
    });

    var swiper = new Swiper(".testimonial-swiper", {
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });


    var swiper = new Swiper(".team-swiper", {
      slidesPerView: 2,
      spaceBetween: 20,
      pagination: {
        el: "#our-team .swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
      },
    });

    window.addEventListener("load", (event) => {
      //isotope
      $('.isotope-container').isotope({
        // options
        itemSelector: '.item',
        layoutMode: 'masonry'
      });



      // Initialize Isotope
      var $container = $('.isotope-container').isotope({
        // options
        itemSelector: '.item',
        layoutMode: 'masonry'
      });

      $(document).ready(function () {
        //active button
        $('.filter-button').click(function () {
          $('.filter-button').removeClass('active');
          $(this).addClass('active');
        });
      });

      // Filter items on button click
      $('.filter-button').click(function () {
        var filterValue = $(this).attr('data-filter');
        if (filterValue === '*') {
          // Show all items
          $container.isotope({ filter: '*' });
        } else {
          // Show filtered items
          $container.isotope({ filter: filterValue });
        }
      });

    });





  }); // End of a document      

  // chatbot support system icon 
  const chatbotToggler = document.querySelector(".chatbot-toggler");
  const closeBtn = document.querySelector(".close-btn");
  const chatbox = document.querySelector(".chatbox");
  const chatInput = document.querySelector(".chat-input textarea");
  const sendChatBtn = document.querySelector(".chat-input span");

  let userMessage = null;
  const inputInitHeight = chatInput.scrollHeight;

  // Function to create chat bubble
  const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
  }

  // Generate a unique chat ID for the session (only once)
  let chatId = localStorage.getItem("chatId");
  if (!chatId) {
    chatId = "chat_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    localStorage.setItem("chatId", chatId);
  }


  // Function to get response from n8n webhook
  const generateResponse = async (chatElement, message) => {
    const messageElement = chatElement.querySelector("p");

    try {
      const response = await fetch("https://n8n.wowvaiya.shop/webhook/getInput", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: message, chatId: chatId, })
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      console.log("🔍 Webhook Response:", data); // debug print

      // Safe parse
      if (Array.isArray(data) && data.length > 0 && data[0].output) {
        messageElement.textContent = data[0].output;
      } else if (data.output) {
        messageElement.textContent = data.output;
      } else {
        messageElement.textContent = "No response from server.";
      }

    } catch (error) {
      messageElement.textContent = "Oops! Something went wrong.";
      console.error(error);
    }

    chatbox.scrollTo(0, chatbox.scrollHeight);
  }



  // Handle chat sending
  const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
      // Display "Thinking..." message while waiting for the response
      const incomingChatLi = createChatLi("Thinking...", "incoming");
      chatbox.appendChild(incomingChatLi);
      chatbox.scrollTo(0, chatbox.scrollHeight);

      // Call n8n webhook
      generateResponse(incomingChatLi, userMessage);
    }, 600);
  }

  chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
  });

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
      e.preventDefault();
      handleChat();
    }
  });

  sendChatBtn.addEventListener("click", handleChat);
  closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
  chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

  // chatbot support system icon End

})(jQuery);