# Highlight template in JS

```js
// ...
const App = {
  components: { BlogPost },
  setup() {
    return {
      posts: Vue.ref([
        {
          id: 1,
          title: 'Example 1',
        }
      ]),
    }
  },
  template: `
    <div id="blog-posts-events-demo">
      <div :style="{ fontSize: postFontSize + 'em' }">
        <blog-post
          v-for="post in posts"
          v-bind:key="post.id"
          v-bind:title="title"
        ></blog-post>
      </div>
    </div>
  `,
}
```
