<script>
    import AssetItem from './AssetItem.svelte';
    import { createEventDispatcher } from 'svelte';

    export let assets = []; 
    
    export let selectedAssetId = null;
    const dispatch = createEventDispatcher();
</script>

<div class="bg-white p-6 rounded-2xl shadow-lg">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Available Assets</h2>
    <div class="space-y-3">
        {#if assets.length > 0}
            {#each assets as asset (asset.id)}
                <AssetItem
                    {asset}
                    isSelected={asset.id === selectedAssetId}
                    on:select={() => dispatch('selectAsset', asset.id)}
                />
            {/each}
        {:else}
            <p class="text-gray-500">Loading assets...</p>
        {/if}
    </div>
</div>