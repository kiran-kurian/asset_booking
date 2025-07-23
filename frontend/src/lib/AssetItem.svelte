<script>
    import { createEventDispatcher } from 'svelte';
    export let asset;
    export let isSelected = false;

    const dispatch = createEventDispatcher();

    $: isUnavailable = asset.status !== 'Available';

    const statusMap = {
        'Available': { text: 'Available', colorClass: 'bg-green-100 text-green-800' },
        'In Use': { text: 'In Use', colorClass: 'bg-yellow-100 text-yellow-800' },
        'Out for Calibration': { text: 'Calibration', colorClass: 'bg-red-100 text-red-800' }
    };
    $: statusInfo = statusMap[asset.status];

    function select() {
        if (!isUnavailable) {
            dispatch('select');
        }
    }
</script>

<div
    on:click={select}
    on:keydown={(e) => {
        if (!isUnavailable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            select();
        }
    }}
    class="p-4 rounded-lg border transition-all duration-200 cursor-pointer
          {isSelected ? 'bg-blue-50 border-blue-500 shadow-md' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}
          {isUnavailable ? 'opacity-50 cursor-not-allowed' : ''}"
    role="button"
    tabindex="0"
>
    <div class="flex justify-between items-center">
        <h3 class="font-semibold text-gray-800">{asset.name}</h3>
        <span class="text-xs font-medium px-2 py-1 rounded-full {statusInfo.colorClass}">
            {statusInfo.text}
        </span>
    </div>
    <p class="text-sm text-gray-500 mt-1">ID: {asset.id}</p>
</div>