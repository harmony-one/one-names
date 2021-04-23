<template>
  <div class="nav">
    <ul>
      <li>
        <img src="https://assets.website-files.com/5ea98076e2f684f39f95888f/5ea98076e2f684fdc09588b9_harmony_logo.svg">
      </li>
      <li>
        <a href="https://onenames.gitbook.io/onenames/" target="_blank">About</a>
      </li>
      <li>
        <a href="https://onenames.gitbook.io/onenames/faq" target="_blank">FAQ</a>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.nav {
	position: relative;
  top: 20px;
  left: 20px;

	ul {
		display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding: 0px;
    margin: 0px;
		list-style-type: none;

		li {
			padding-right: 30px;
		}
	}
	a, a:hover {
		color: #fff;
		text-decoration: none;
	}
}
</style>