import './style.css';

const app = document.getElementById('app');

if (app) {
  app.innerHTML = `
    <div class="container">
      <h1>Welcome to <%= projectName %></h1>
      <p>Edit <code>src/main.ts</code> to get started</p>
    </div>
  `;
}
