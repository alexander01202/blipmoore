// src/plugins/withAndroidxWorkRuntimeWorkaround.js

// eslint-disable-next-line import/no-internal-modules
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode')
const { withAppBuildGradle, createRunOncePlugin } = require('@expo/config-plugins')

function withAndroidxWorkRuntimeWorkaround(config) {
  // Return the modified config.
  return withAppBuildGradle(config, (c) => {
    // eslint-disable-next-line no-param-reassign
    c.modResults.contents = mergeContents({
      src: c.modResults.contents,
      newSrc: `    def work_version = "2.7.0"

    // (Java only)
    implementation "androidx.work:work-runtime:$work_version"
    // Kotlin + coroutines
    implementation "androidx.work:work-runtime-ktx:$work_version"`,
      anchor: /dependencies\s?{/,
      offset: 1,
      tag: 'my-app(androidx.work:workaround)',
      comment: '//',
    }).contents

    return c
  })
}

module.exports = createRunOncePlugin(
  withAndroidxWorkRuntimeWorkaround,
  'withAndroidxWorkRuntimeWorkaround',
  '1.0.0'
)