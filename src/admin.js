const intents = [
  { name: 'Car Rental',
    entities: [
      { name: 'Pickup-Location', selection: null },
      { name: 'Pickup-Date', selection: null },
      { name: 'Category', selection: null },
      { name: 'Model', selection: null },
      { name: 'Dropoff-Location', selection: null },
      { name: 'Dropoff-Date', selection: null },
      { name: 'Budget', selection: null },
      { name: 'Transmission', selection: null }
    ]
  },{ name: 'Accomodation',
    entities: [
      { name: 'Checkin-Date', selection: null },
      { name: 'Checkout-Date', selection: null },
      { name: 'Category', selection: null },
      { name: 'At', selection: null },
      { name: 'Amenities', selection: null },
      { name: 'Budget', selection: null },
      { name: 'Room type', selection: null },
      { name: 'Participant', selection: null }
    ]
    },{ name: 'Restaurant',
    entities: [
      { name: 'When', selection: null },
      { name: 'At', selection: null },
      { name: 'Participant', selection: null },
      { name: 'Cuisine type', selection: null },
      { name: 'Budget', selection: null }
    ]
      },{ name: 'Flight',
    entities: [
      { name: 'Departure-Location', selection: null },
      { name: 'Departure-Date', selection: null },
      { name: 'Arrival-Location', selection: null },
      { name: 'Arrival-Date', selection: null },
      { name: 'Class', selection: null },
      { name: 'Participants', selection: null },
      { name: 'Max-stops', selection: null }
    ]
  },
  { name: 'Delivery',
    entities: [
      { name: 'Object', selection: null },
      { name: 'When', selection: null },
      { name: 'Where', selection: null }
    ]
  }
]

var app = new Vue({
  el: '#app',
  created() {
    this.$on('intent-focus', focus => this.entities = focus.entities || [])

    this.$on('new-entity', entity => this.addEntity(entity))

    this.$on('add-entity-principal-focus', entity => this.newEntityName = entity.name || entity)

    this.$on('history', history => this.history = history)

    this.$on('remove-entity', entity => this.remove(entity))

    this.$on('unfocus-all-entities', () => this.entities.forEach(each => each.state = ''))

    this.$on('selection-on', selection => {
      const message = this.history.find(each => each.id == selection.message).content
      const entitySelection = window.service.entitySelection(selection)
      this.newEntity = message.substring(entitySelection.begin, entitySelection.begin + entitySelection.count)
      this.listenToMessageSelection = false
    })
  },
  methods: {
    listenToSelection() {
      this.listenToMessageSelection = true
    },
    toggleAddEntity() {
      this.addEntityIsExpanded = !this.addEntityIsExpanded
    },
    style(entity) {
      return {
        'light-grey-on-hover': entity.state == 'mouseover',
        'dark-grey-on-focus': entity.state == 'focused'
      }
    },
    entity(selection) {
      return this.visibleEntities.find(each => each.selection === selection)
    },
    highlight(selection) {
      const target = this.entity(selection)
      if (target && target.state != 'focused') target.state = 'mouseover'
    },
    focusOn(selection) {
      const target = this.entity(selection)
      if (target) target.state = 'focused'
    },
    unhighlight(selection) {
      const target = this.entity(selection)
      if (target && target.state == 'mouseover') target.state = ''
    },
    selectionText({ message, begin, count }) {
      return this.history.find(each => each.id == message).content.substring(begin, begin + count)
    },
    selectionFrom(inputText) {
      const matchedMessage = this.history.find(each => each.content.indexOf(inputText) > -1)
      if (!matchedMessage) {
        return
      }

      const anchorOffset = matchedMessage.content.indexOf(inputText)
      return {
        anchorOffset,
        focusOffset: anchorOffset + inputText.length,
        message: matchedMessage.id
      }
    },
    addEntityAndReset() {
      this.addEntity();
      this.newEntity = ''
    },
    addEntity(entity) {
      let rawSelection = (entity || {}).selection || this.newEntity

      if (!entity) {
        rawSelection = this.selectionFrom(this.newEntity);
      }

      if (!rawSelection) {
        throw new Error('Cannot find a message selection that matches the input')
      }

      const name = (entity || {}).name || this.newEntityName

      if (!name) return

      const selection = entitySelection(rawSelection)

      const ref = this.entities.find(each => each.name === name)
      if (ref) ref.selection = selection
      else this.entities.push({ name, selection })

      this.addEntityIsExpanded = false
    },
    remove(entity) {
      entity.selection = null
    },
    nullIntent(name) {
      return { name, entities: [] }
    },
    nullEntity(name) {
      return { name, selection: null }
    }
  },
  computed: {
    visibleEntities() {
      return this.entities.filter(each => each.selection !== null)
    },
    emptyEntities() {
      return this.entities.filter(each => each.selection === null)
    }
  },
  data: {
    listenToMessageSelection: false,
    addEntityIsExpanded: false,
    history: [],
    entities: [],
    intents,
    newEntityName: '',
    newEntity: ''
  }
})
