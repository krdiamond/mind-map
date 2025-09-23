<template>
  <div>

     <div class="wrapper">
        <div class="close" @pointerdown.stop @click.stop="$emit('close')">
          <svg fill="#000000" width="800px" height="800px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
            <path d="M797.32 985.882 344.772 1438.43l188.561 188.562 452.549-452.549 452.548 452.549 188.562-188.562-452.549-452.548 452.549-452.549-188.562-188.561L985.882 797.32 533.333 344.772 344.772 533.333z"/>
        </svg>
    </div>
        <h2 class="m-12">one unique album per/day</h2>
        <div class="m-12">
          <p class="mb-6">September 2025</p>
          <table>
            <tbody>
               <tr>
                <td>9.23.2025</td>
                <td>Bratmobile - Pottymouth</td>
                <td><span class="emoji">😊</span></td>
              </tr>
              <tr>
                <td>9.22.2025</td>
                <td>Bob Desper - New Sounds</td>
                <td><span class="emoji">😐</span></td>
              </tr>
              <tr>
                <td>9.21.2025</td>
                <td>Samiam - Clumsy</td>
                <td><span class="emoji">😊</span></td>
              </tr>
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
                <td>9.15.2025</td>
                <td>Militarie Gun - Life Under the Gun</td>
                <td><span class="emoji">😐</span></td>
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