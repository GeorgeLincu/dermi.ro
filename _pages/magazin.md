
---
permalink: /magazin/
title: 'Magazin'
---

<link rel="preconnect" href="https://cdn.snipcart.com" />
<link rel="stylesheet" href="https://cdn.snipcart.com/themes/v3.6.1/default/snipcart.css" />

<div class="grid__wrapper">
{% for p in site.data.products %}
  <div class="archive__item">
    <div class="archive__item-teaser">
      <img src="{{ p.image }}" alt="{{ p.name }}">
    </div>
    <h2 class="archive__item-title">{{ p.name }}</h2>
    <p>{{ p.description }}</p>
    <p><strong>{{ p.price | append: ' RON' }}</strong></p>
    <button class="btn btn--primary snipcart-add-item"
            data-item-id="{{ p.id }}"
            data-item-price="{{ p.price }}"
            data-item-url="/magazin/"
            data-item-name="{{ p.name }}">
      Adaugă în coș
    </button>
  </div>
{% endfor %}
</div>

<div hidden id="snipcart" data-api-key="YOUR_SNIPCART_PUBLIC_API_KEY"></div>
<script async src="https://cdn.snipcart.com/themes/v3.6.1/default/snipcart.js"></script>
