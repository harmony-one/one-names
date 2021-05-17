<template>
  <section class="section">
    <div class="container">
      <div class="inner_container">
        <div class="maintenance_text">
          Under maintenance. Sorry for the inconvenience. Back soon!
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
body {
  background-color: #00b0ef;
}
</style>

<style lang="scss" scoped>
.maintenance_text {
  color: white;
  font-weight: bold;
  font-size: 24px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: top;
  margin-top: 85px;
  text-align: center;

  .inner_container {
    min-width: 60%;
    min-height: 200px;
  }
}
</style>
