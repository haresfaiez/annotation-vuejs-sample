const template =
`<div class="row">
<div class="col-7 card">
  <div class="chat-box">
    <ul class="list-group list-group-flush">
      <li v-for="message in history"
        class="list-group-item"
        :class="{ 'right-aligned': isMyMessage(message) }">
        <aside v-if="!isMyMessage(message)" class="chat-message-author">
          {{message.source.username || message.source}}
        </aside>
        <div class="d-flex full-width" :class="{ 'flex-row-reverse': isMyMessage(message)}">
        <message 
            :id="message.id"
            :source="source.username"
            :message="message"
            :addedAttachements="[]"
            :selection="[]"
            :addedEntities="[]" />
        </div>
      </li>
    </ul>
  </div>
  <div class="card flex-row chat-input">
    <textarea class="form-control" placeholder="Message" v-model="message" rows="1" />
    <button class="btn btn-outline-primary" v-on:click="sendMessage()">
      <i class="fas fa-paper-plane"></i>
    </button>
  </div>
</div>
</div>`

Vue.component('chat', {
  props: ['source' ],
  created() {
  },
  mounted() {
    this.poll = setInterval(() => {
      service.pull()
        .then(response => {
          this.history = response
          this.$parent.$emit('history', this.history)
        })
    }, 1000)
  },
  methods: {
    isMyMessage(message) {
      return message.source !== 'admin'
    },
    sendMessage() {
      service.pushAs(this.source, this.message)
        .then(response => {
          this.message = ''
        })
    }
  },
  data() {
    return {
      history: [],
      message: ''
    }
  },
  template
})
