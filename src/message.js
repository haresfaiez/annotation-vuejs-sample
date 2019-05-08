const messageTemplate =
`<div class="card chat-message mono-space-font" :class="background()">
  <div>
    <div v-for="attachement in attachements" v-if="!focusedEntity()">
      <div v-for="character in highlights(attachement)" :style="highlight(character)">
      </div>
    </div>
  </div>
  <div :id="id" class="z-index-2 d-flex" v-if="focusedEntity()">
    <span class="half-transparent">
      {{ message.content.substring(0, focusedEntity().selection.begin) }}
    </span>
    <b :style="{ 'background-color': 'rgba(255, 0, 0, 0.5)' }">{{ entitySelectionText(focusedEntity()) }}</b>
    <span class="half-transparent">
      {{ message.content.substring(entitySelectionEnd(focusedEntity())) }}
    </span>
  </div>
  <div :id="id" class="z-index-2" :class="{ 'half-transparent': anyEntityFocused() }" v-else>
    {{ message.content }}
  </div>
</div>`

Vue.component('message', {
  props: [ 'id', 'message', 'addedAttachements', 'selection', 'addedEntities', 'source' ],
  computed: {
    attachements() {
      const editedEntity = this.selection ? [{ selection: this.selection, state: 'edited' }] : []
      return [...this.addedAttachements, ...editedEntity ]
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    anyEntityFocused() {
      return this.addedEntities.find(each => each.state === 'focused')
    },
    focusedEntity() {
      return this.addedAttachements.find(each => each.state === 'focused')
    },
    background() {
      return { 'bg-primary': this.isMyMessage(),
               'my-message': this.isMyMessage(),
               'other-person-message': !this.isMyMessage()
             }
    },
    isMyMessage() {
      return (this.message.source.username || this.message.source) == (this.source.username || this.source)
    },
    lineHeight() {
      return (document.getElementById(`${this.message.id}`) || {}).offsetHeight || 0
    },
    charWidth() {
      const messageWidth = (document.getElementById(`${this.message.id}`) || {}).offsetWidth || 0
      const charCount = this.message.content.length
      return messageWidth / charCount;
    },
    entitySelectionEnd(entity) {
      const { begin, count } = entity.selection
      return begin + count
    },
    entitySelectionText(entity) {
      return this.message.content.substring(entity.selection.begin , this.entitySelectionEnd(entity))
    },
    highlights(attachement) {
      const { begin, count } = attachement.selection
      return this.entitySelectionText(attachement)
        .split('')
        .map((each, offset) => ({ attachement, offset: offset + begin }))
    },
    highlight(character) {
      if (!character) return

      const opacity = {
        mouseover: 40,
        focused: 60
      }

      const color = {
        edited: 'purple',
        mouseover: 'red',
        focused: 'red',
        highlighted: 'green'
      }

      return { 'background-color': color[character.attachement.state] || color['highlighted'],
               position: 'absolute',
               width: `${this.charWidth()}px`,
               height: `${this.lineHeight()}px`,
               opacity: (opacity[character.attachement.state] || 20) / 100,
               'margin-left': `${this.charWidth() * character.offset}px`
             }
    }
  },
  data() {
    return {
    }
  },
  template: messageTemplate
})
