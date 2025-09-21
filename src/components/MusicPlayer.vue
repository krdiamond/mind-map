<template>
  <div>
      <div class="close" @click="$emit('close')">X</div>
        <h2 class="m-12">one unique album per/day</h2>
        <div class="m-12">
          <p class="mb-6">September 2025</p>
          <table>
            <tbody>
               <tr>
                <td>9.20.2025</td>
                <td>Gang of Four - Entertainment!</td>
                <td><span class="emoji">😊</span></td>
              </tr>
              <tr>
                <td>9.19.2025</td>
                <td>Codeine - Frigid Stars</td>
                <td><span class="emoji">😊</span></td>
              </tr>
              <tr>
                <td>9.18.2025</td>
                <td>Jets to Brazil - Orange Rhyming Dictionary</td>
                <td><span class="emoji">😐</span></td>
              </tr>
              <tr>
                <td>9.17.2025</td>
                <td>The Damned - Damned Damned Damned</td>
                <td><span class="emoji">😊</span></td>
              </tr>
              <tr>
                <td>9.16.2025</td>
                <td>Deftones - Private Music</td>
                <td><span class="emoji">😊</span></td>
              </tr>
              <tr>
                <td>9.11.2025</td>
                <td>Unwound - Repetition</td>
                <td><span class="emoji">😊</span></td>
              </tr>
              <tr>
                <td>9.10.2025</td>
                <td>Free Throw - Those Days Are Gone</td>
                <td><span class="emoji">😊</span></td>
              </tr>
              <tr>
                <td>9.09.2025</td>
                <td>American Football - Self Titled</td>
                <td><span class="emoji">😐</span></td>
              </tr>
              <tr>
                <td>9.08.2025</td>
                <td>Smog - Knock Knock</td>
                <td><span class="emoji">😊</span></td>
              </tr>
            </tbody>
          </table>
        </div>



      </div>
</template>

<style scoped>

table {
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
  }

  th, td {
    border: 1px solid black;
    padding: 0 6px;
    text-align: left;
  }

  td:last-child {
  padding: 0 3px;
}

</style>