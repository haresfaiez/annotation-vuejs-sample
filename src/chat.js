const template =
`<div class="row">
<div class="col-7 card">
  <div class="chat-box">
    <ul class="list-group list-group-flush">
      <li v-for="message in history"
        @mousedown="startSelection"
        @mouseup="endSelection"
        class="list-group-item"
        :class="{ 'right-aligned': isMyMessage(message) }">
        <aside v-if="!isMyMessage(message)" class="chat-message-author">
          {{message.source.username || message.source}}
        </aside>
        <div class="d-flex full-width" :class="{ 'flex-row-reverse': isMyMessage(message)}">
        <message 
            :id="message.id"
            :source="'admin'"
            :message="message"
            :addedAttachements="entitiesAttachedTo(message)"
            :selection="entitySelection(message)"
            :addedEntities="commands" />
          <div
            v-if="selection && (selection.message == message.id) && useContextualMenu()"
            class="default-left-margin default-right-margin">
            <button class="btn btn-light" v-on:click="expandAddEntityHeader()">
              <i class="fas fa-plus"></i>
              Add entity
            </button>
          </div>
          <div
            v-if="focusedEntity(message)"
            class="default-left-margin default-right-margin">
            <button class="btn btn-light" v-on:click="remove(focusedEntity(message))">
              <i class="fas fa-minus"></i>
              Remove entity
            </button>
          </div>
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
<div class="col-4"v-if="selection">
  <div v-if="selection && isAddEntityHoverExpanded" class="d-flex">
    <editable-dropdown
      :id="'add-entity-hover'"
      :range="suggestions"
      :null-value="nullEntity"
      :title="'Entity name'" />
    <button class="btn btn-outline-primary no-border" v-on:click="addEntity()">
       <i class="fas fa-save"></i>
    </button>
  </div>

  <div v-if="!useContextualMenu()">
    <ul class="list-group list-group-flush">
      <li v-for="suggestion in suggestions" class="list-group-item no-left-padding">
        <button 
          class="btn btn-light" v-on:click="addEntity(suggestion)">
          {{suggestion.name}}
       </button>
      </li>
    </ul>
    <div class="card flex-row chat-input">
      <input class="form-control" v-model="newEntityName" placeholder="Entity name">
      <button class="btn btn-outline-primary" v-on:click="addEntity()">
        <i class="fas fa-save"></i>
      </button>
    </div>
  </div>
</div>
</div>`

Vue.component('chat', {
  props: ['source', 'suggestions', 'commands', 'notifyOnSelection' ],
  created() {
    this.$on('add-entity-hover-focus', entity => {
      this.newEntityName = entity.name
    })
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
    useContextualMenu() {
      return window.useContextualMenu == true
    },
    entitySelection(message) {
      const result = this.selection && window.service.entitySelection(this.selection)

      if (result && result.message == message.id) return result
    },
    remove(entity) {
      this.$parent.$emit('remove-entity', entity)
    },
    isMyMessage(message) {
      return message.source === 'admin'
    },
    entitiesAttachedTo(message) {
      const isAttachedTo = message => entity => entity.selection.message == message.id
      return this.commands.filter(isAttachedTo(message))
    },
    focusedEntity(message) {
      return this.entitiesAttachedTo(message).find(each => each.state == 'focused')
    },
    nullEntity(name) {
      return { name, selection: null }
    },
    expandAddEntityHeader() {
      this.isAddEntityHoverExpanded = true
    },
    addEntity(subject) {
      const entity = Object.assign({}, subject || { name: this.newEntityName} , { selection: this.selection })
      if (!entity.name) return

      this.$parent.$emit('new-entity', entity)
      this.selection = null
    },
    startSelection() {
    },
    endSelection() {
      setTimeout(() => {
        this.$parent.$emit('unfocus-all-entities')

        const selection = window.getSelection()

        if (!selection.anchorNode || !selection.anchorNode.data)
          return

        if (selection.anchorOffset == selection.focusOffset) {
          this.selection = null
          return
        }

        // if anchorNode == focusNode
        const content = selection.anchorNode.data
        if (!content.trim()) {
          this.selection = null
          return
        }

        // create a layer in the background
        const textContent = selection.anchorNode.textContent.match(/([\n ]+)(.*)/)
        const essenceMessage = textContent.pop()
        const padStart = textContent.pop()

        const result = {
          message: selection.anchorNode.parentElement.id,
          anchorOffset: selection.anchorOffset - padStart.length,
          focusOffset: selection.focusOffset - padStart.length
        }

        if (this.notifyOnSelection) {
          this.$parent.$emit('selection-on', result)
        } else {
          this.selection = result
        }
      })
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
      message: '',
      newEntityName: '',
      selection: null,
      isAddEntityHoverExpanded: false
    }
  },
  template
})
