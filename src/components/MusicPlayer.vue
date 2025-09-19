<template>
  <div>
      <div class="close" @click="$emit('close')">X</div>
        <h2 class="m-12">one unique album per/day</h2>
        <div class="m-12">
          <p class="mb-6">September 2025</p>
          <table class="album-table">
            <tbody>
              <tr>
                <td>9.19.2025</td>
                <td>Codeine - Frigid Stars</td>
                <td>🤯</td>
              </tr>
              <tr>
                <td>9.18.2025</td>
                <td>Jets to Brazil - Orange Rhyming Dictionary</td>
                <td>😐</td>
              </tr>
              <tr>
                <td>9.11.2025</td>
                <td>Unwound - Repetition</td>
                <td>😊</td>
              </tr>
              <tr>
                <td>9.10.2025</td>
                <td>Free Throw - Those Days Are Gone</td>
                <td>😊</td>
              </tr>
              <tr>
                <td>9.09.2025</td>
                <td>American Football - Self Titled</td>
                <td>😐</td>
              </tr>
              <tr>
                <td>9.08.2025</td>
                <td>Smog - Knock Knock</td>
                <td>😊</td>
              </tr>
            </tbody>
          </table>
        </div>



      </div>
</template>


<style>
  .album-table {
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
  }
  .album-table th,
  .album-table td {
    border: 1px solid black;
    padding: 0 6px;
    text-align: left;
  }


</style>