import Vue from 'vue'
import pluralize from 'pluralize'

Vue.filter('pluralize', function (value, number) {
  return pluralize(value, number)
})
