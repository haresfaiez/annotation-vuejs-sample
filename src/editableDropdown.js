const dropdownTemplate =
`<div class="dropdown">
  <div class="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown">
  <input type="text" class="form-control" :placeholder="title" v-model="value">
  </div>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <div class="dropdown-item"
        v-for="proposition in range"
        v-on:click="setValue(proposition)"
        :class="{ active: isSelected(label(proposition)) }">
      {{label(proposition)}}
    </div>
  </div>
</div>`

Vue.component('editableDropdown', {
  props: ['id', 'range', 'nullValue', 'title'],
  data() {
    return {
      value: ''
    }
  },
  watch: {
    'value': function(val, oldVal) {
      if (this.id) {
        const focus = this.range.find(each => each.name === this.value)
              || (this. nullValue && this.nullValue(this.value)) || {}
        this.$parent.$emit(`${this.id}-focus`, focus)
      }
    }
  },
  mounted() {
  },
  methods: {
    label(proposition) {
      return proposition.name || proposition
    },
    isSelected(potentialValue) {
      return this.value.trim() === potentialValue;
    },
    setValue(selection) {
      this.value = this.label(selection)
    }
  },
  template: dropdownTemplate
})
