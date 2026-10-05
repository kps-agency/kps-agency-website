<template>
  <BlogListing :page="page" />
</template>

<script setup lang="ts">
// Pages suivantes du blog : /blog/page/2, /blog/page/3… (la première page reste /blog)
const route = useRoute()
const { link } = useSite()
const raw = String(route.params.n)
const page = /^[1-9]\d*$/.test(raw) ? Number(raw) : 0
if (page === 1) await navigateTo(link.blog(), { redirectCode: 301 })
</script>
