<template>
  <section class="section">
    <div class="container">
      <div class="inner_container">
        <div class="white">
          Under maintenance. Sorry for the inconvenience. Back soon!
        </div>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
$break-small: 800px;

$green: #69FABD;
$red: red;
$button: #1B295E;

.white {
  color: white;
  font-weight: bold;
  font-size: 24px;
}

.loading {
  color: #fff;
  font-size: 20px;
}

.green {
  color: $green;
  font-weight: 600;
}

.red {
  color: red;
}

button {
  cursor: pointer;
}

.container {
  display: flex;
  justify-content: center;
  align-items: top;
  margin-top: 85px;
  text-align: center;
}

.inner_container {
  min-width: 60%;
  min-height: 200px;

  @media screen and (max-width: $break-small) {
    min-width: 90%;
  }

  .logo {
    margin-bottom: 50px;
    height: 74px;

    @media screen and (max-width: $break-small) {
      margin-bottom: 0;
    }

    img {
      width: 323px;

      @media screen and (max-width: $break-small) {
        width: 200px;
      }
    }
  }
}

form {
  display: flex;

  ::placeholder {
    color: #ccc;
  }

  i {
    position: absolute;
    font-size: 30px;
    color: #ccc;
  }

  .icon {
    padding: 10px;
    margin-top: 30px;
    margin-left: 15px;
    width: 27px;
    height: 27px;
    background: url(/images/search.svg) no-repeat;

    @media screen and (max-width: $break-small) {
      display: none;
    }
  }

  button {
    border-radius: 0px 6px 6px 0px;
    display: block;
    background: $button;
    color: white;
    font-size: 22px;
    padding: 20px 0px;
    height: 90px;
    width: 162px;
    border: none;

    @media screen and (max-width: $break-small) {
      height: 50px;
      padding: 10px 0px;
      font-size: 18px;
    }

    &:disabled {
      background: rgb(199, 211, 227);
    }

    &:hover {
      opacity: 0.8;
    }
  }
}

.search {
  border-radius: 6px 0px 0px 6px !important;
  font-size: 28px !important;
  padding: 20px 0px 20px 55px;
  width: 100%;
  border: none;
  border-radius: 0px;
  font-size: 18px;
  font-weight: 100 !important;
  font-family: 'Nunito', sans-serif !important;

  @media screen and (max-width: $break-small) {
    font-size: 14px !important;
    padding: 5px 10px;
    height: 40px;
    width: 100%;
  }
}

.priceContainer {
  margin-top: 10px;
  min-height: 60px;
  color: #fff;
  display: flex;
  justify-content: center;

  .hostname {
    padding-right: 20px;
  }
}

.search_result_container {
  color: #fff;
  font-size: 20px;
  .search_result {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .register_container {
      margin-top: 20px;
      color: $green;
      display: flex;
      justify-content: center;

      button {
        border-radius: 6px;
        display: block;
        background: $button;
        color: white;
        font-size: 18px;
        padding: 6px 20px;
        height: 40px;
        width: auto;
        border: none;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

  .congrats {
    font-weight: bold;
  }

  pre {
    font-size: 14px;
  }

  .confirmation_result {
    justify-content: center;
    div {
      margin-right: 10px;
    }

    a {
      color: $green;

      &:hover {
        opacity: 0.7;
      }
    }
  }

  .dnsRegistration {
    margin-top: 20px;
  }

  .confirmation {
    a {
      color: #fff;
      font-size: 16px;

      &:hover {
        opacity: 0.7;
      }
    }
  }
}

.twitter_modal {
  background-color: #dbf2ff;
  height: 100vh;
  padding: 20px;

  ::placeholder {
    color: #ccc;
  }

  .twitter_info {
    margin-top: 20px;
  }

  .twitter-icon {
    padding: 10px;
    margin-top: 58px;
    position: absolute;
    margin-left: 15px !important;
    width: 27px;
    height: 27px;
    filter: invert(50%) sepia(83%) saturate(1482%) hue-rotate(178deg) brightness(96%) contrast(104%);
    background: url(/images/twitter.svg) no-repeat;
  }

  input {
    margin-top: 50px;
    border-radius: 6px !important;
    font-size: 18px !important;
    padding: 10px 0px 10px 55px;
    width: 50%;
    border: none;
    border-radius: 0px;
    font-size: 18px;
    font-weight: 100;
  }

  .button_container {
    display: flex;
    justify-content: center;
    margin-top: 10px;

    :last-child {
      margin-left: 10px;
      opacity: 0.7;
    }

    button {
      border-radius: 6px;
      display: block;
      background: $button;
      color: white;
      font-size: 18px;
      padding: 6px 0px;
      height: 40px;
      width: 162px;
      border: none;

      &:hover {
        opacity: 0.6;
      }
    }
  }
}
</style>
