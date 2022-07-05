<template>
  <v-dialog v-model="toggle" persistent width="1000">
    <v-card class="pt-6 pb-2">
      <v-row class="d-flex justify-space-between mx-9 my-1">
        <h1>Add Task</h1>
        <v-btn
          class="mx-2 rotate"
          fab
          dark
          small
          color="primary"
          @click="close"
        >
          <v-icon dark> mdi-plus </v-icon>
        </v-btn>
      </v-row>
      <v-form @submit.prevent="onSubmit" class="mt-6 overflow-hidden">
        <v-row justify="space-around">
          <v-col cols="11" md="5">
            <v-text-field
              v-model="NewTask.name"
              label="Task Name"
              required
            ></v-text-field>

            <v-textarea
              filled
              v-model="NewTask.description"
              label="Enter decription"
              required
            ></v-textarea>

            <v-divider inset></v-divider>

            <v-select
              v-model="NewTask.type"
              :items="['Instant', 'Scheduled']"
              item-text="state"
              item-value="abbr"
              label="Task Type"
              persistent-hint
              return-object
              single-line
            ></v-select>

            <v-checkbox
              v-model="NewTask.claimed"
              :label="`Claimed`"
            ></v-checkbox>

            <v-col cols="12">
              <v-autocomplete
                v-model="NewTask.friends"
                :disabled="isUpdating"
                :items="people"
                filled
                chips
                color="blue-grey lighten-2"
                label="Select"
                item-text="name"
                item-value="name"
                multiple
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    v-if="NewTask.friends.indexOf(data.item.name) < 2"
                    :input-value="data.selected"
                    close
                    @click="data.select"
                    @click:close="remove(data.item)"
                  >
                    {{ data.item.name }}
                  </v-chip>
                  <span
                    v-if="NewTask.friends.indexOf(data.item.name) === 2"
                    class="black--text text-caption"
                  >
                    (+{{ NewTask.friends.length - 2 }} others)
                  </span>
                </template>
                <template v-slot:item="data">
                  <template v-if="typeof data.item !== 'object'">
                    <v-list-item-content
                      v-text="data.item"
                    ></v-list-item-content>
                  </template>
                  <template v-else>
                    <v-list-item-content>
                      <v-list-item-title
                        v-html="data.item.name"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </template>
              </v-autocomplete>
            </v-col>

            <h5>Priority</h5>
            <v-radio-group v-model="NewTask.priority">
              <v-row class="d-flex justify-space-between align-start">
                <v-radio
                  v-for="n in ['Low', 'Meduim', 'High']"
                  :key="n"
                  :label="`${n}`"
                  :value="n"
                ></v-radio>
              </v-row>
            </v-radio-group>

            <v-textarea
              filled
              v-model="NewTask.priorityImpact"
              label="Enter Priority Impact"
              required
            ></v-textarea>
          </v-col>

          <v-divider vertical></v-divider>

          <v-col cols="11" md="5">
            <h5>Severity</h5>
            <v-radio-group v-model="NewTask.severity">
              <v-row class="d-flex justify-space-between align-start">
                <v-radio
                  v-for="n in ['Low', 'Meduim', 'High']"
                  :key="n"
                  :label="`${n}`"
                  :value="n"
                ></v-radio>
              </v-row>
            </v-radio-group>

            <v-textarea
              filled
              v-model="NewTask.severityImpact"
              label="Enter Severity Impact"
              required
            ></v-textarea>

            <v-divider inset></v-divider>

            <v-row class="mt-5">
              <v-col cols="11" sm="6">
                <v-row class="d-flex justify-space-between">
                  <v-col>
                    <v-menu
                      ref="menu"
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="time"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="NewTask.dueTime"
                          label="Picker in menu"
                          prepend-icon="mdi-clock-time-four-outline"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menu2"
                        v-model="NewTask.dueTime"
                        format="24hr"
                        :allowed-hours="allowedHours"
                        full-width
                        @click:minute="$refs.menu.save(time)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="11" sm="6">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="dates"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-combobox
                      v-model="NewTask.dueDate"
                      chips
                      small-chips
                      label="Multiple picker in menu"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-combobox>
                  </template>
                  <v-date-picker
                    v-model="NewTask.dueDate"
                    :allowed-dates="allowedDates"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">
                      Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="menu = false">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <template>
              <v-row>
                <v-col>
                  <v-menu
                    ref="menu"
                    v-model="menu3"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="time"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="NewTask.estTime"
                        label="Picker in menu"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="menu3"
                      v-model="NewTask.estTime"
                      format="24hr"
                      :allowed-hours="allowedHours"
                      full-width
                      @click:minute="$refs.menu.save(time)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </template>

            <v-text-field
              v-model="NewTask.tags"
              label="Tags"
              required
              class="my-6"
            ></v-text-field>

            <v-container class="d-flex justify-end">
              <v-btn type="submit" elevation="2" class="green"> Submit </v-btn>
            </v-container>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AddTask',
  components: {},
  props: {
    toggle: Boolean,
  },
  data() {
    return {
      time: null,
      time2: null,
      menu: false,
      menu2: false,
      menu3: false,
      dates: [],

      autoUpdate: true,
      isUpdating: false,
      people: [
        { name: 'Sandra Adams' },
        { name: 'Ali Connors' },
        { name: 'Trevor Hansen' },
        { name: 'Tucker Smith' },
      ],
      NewTask: {
        name: '',
        description: '',
        type: '',
        assigneeName: '',
        claimed: false,
        priority: '',
        priorityImpact: '',
        severity: '',
        severityImpact: '',
        dueDate: '',
        dueTime: '',
        estTime: '',
        tags: '',
        checked: false,
        friends: [],
      },
    }
  },
  methods: {
    onSubmit(e) {
      this.$store.commit('addTask', this.NewTask)
      this.$emit('close')
    },
    close() {
      this.$emit('close')
    },
    remove(item) {
      const index = this.NewTask.friends.indexOf(item.name)
      if (index >= 0) this.NewTask.friends.splice(index, 1)
    },
    allowedDates(val) {
      return (
        (parseInt(val.split('-')[0], 10) >= new Date().getFullYear() &&
          parseInt(val.split('-')[1], 10) > new Date().getMonth() + 1) ||
        (parseInt(val.split('-')[2], 10) >= new Date().getDate() &&
          parseInt(val.split('-')[1], 10) == new Date().getMonth() + 1)
      )
    },
    allowedHours(v) {
      return v >= new Date().getHours()
    },
  },

  watch: {
    isUpdating(val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 3000)
      }
    },
  },
}
</script>
<style scoped>
.rotate {
  transform: rotateZ(45deg);
}
</style>
