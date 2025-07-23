<script>
    import { onMount } from 'svelte';
    import AssetList from './lib/AssetList.svelte';
    import BookingCalendar from './lib/BookingCalendar.svelte';
    import TimeSlotPicker from './lib/TimeSlotPicker.svelte';
    import { z } from 'zod';

    // State variables
    let assets = [];
    let assetBookings = {};
    let selectedAssetId = null;
    let selectedDate = null;
    let selectedTimeSlot = null;
    let validationError = ''; 
    let apiError = ''; 
    let isLoading = true;

    onMount(async () => {
        try {
            const response = await fetch('http://localhost:3000/api/assets');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            assets = await response.json();
        } catch (error) {
            console.error("Failed to fetch assets:", error);
            apiError = "Could not connect to the server. Please try again later.";
        } finally {
            isLoading = false;
        }
    });

    $: selectedAsset = assets.find(a => a.id === selectedAssetId);
    $: isFormValid = selectedAssetId && selectedDate && selectedTimeSlot;

    // Fetch bookings when an asset is selected
    async function handleAssetSelect(event) {
        selectedAssetId = event.detail;
        selectedDate = null;
        selectedTimeSlot = null;
        validationError = '';
        apiError = '';
        assetBookings = {};

        if (selectedAssetId) {
            try {
                const response = await fetch(`http://localhost:3000/api/bookings/${selectedAssetId}`);
                assetBookings = await response.json();
            } catch (error) {
                apiError = "Could not fetch bookings for this asset.";
            }
        }
    }
    
    function handleDateSelect(event) {
        selectedDate = event.detail;
        selectedTimeSlot = null;
        validationError = '';
        apiError = '';
    }

    function handleTimeSlotSelect(event) {
        selectedTimeSlot = event.detail;
        validationError = '';
        apiError = '';
    }

    const bookingSchema = z.object({
        assetId: z.string().min(1, "Asset selection is required."),
        date: z.string().min(1, "Date selection is required."),
        time: z.string().min(1, "Time slot selection is required."),
    });

    async function handleBookingSubmit() {
        validationError = '';
        apiError = '';

        const result = bookingSchema.safeParse({
            assetId: selectedAssetId,
            date: selectedDate,
            time: selectedTimeSlot,
        });

        if (!result.success) {
            validationError = result.error.issues[0].message;
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result.data),
            });

            if (response.ok) {
                alert(`Successfully booked ${selectedAsset.name}!`);

                const bookingsRes = await fetch(`http://localhost:3000/api/bookings/${selectedAssetId}`);
                assetBookings = await bookingsRes.json();

                selectedAssetId = null;
                selectedDate = null;
                selectedTimeSlot = null;
            } else {
                const errorData = await response.json();
                apiError = errorData.error || 'An unknown error occurred.';

                if (response.status === 409) {
                    const bookingsRes = await fetch(`http://localhost:3000/api/bookings/${selectedAssetId}`);
                    assetBookings = await bookingsRes.json();
                }
            }
        } catch (error) {
            apiError = "Booking failed. Could not connect to the server.";
        }
    }
</script>

<main class="container mx-auto p-4 md:p-8 max-w-6xl">
    <header class="mb-8">
        <h1 class="text-5xl font-extrabold text-teal-900 tracking-tight">Asset Booking</h1>
        <p class="text-gray-500 mt-2">Book lab equipment and manage your resources efficiently.</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Asset List -->
        <div class="lg:col-span-1">
            <AssetList {assets} {selectedAssetId} on:selectAsset={handleAssetSelect} />
        </div>

        <!-- Booking Details -->
        <div class="lg:col-span-2">
            {#if selectedAsset}
                <div class="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 class="text-2xl font-bold text-gray-800 mb-1">Book "{selectedAsset.name}"</h2>
                    <p class="text-gray-500 mb-6">ID: {selectedAsset.id}</p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BookingCalendar on:selectDate={handleDateSelect} bind:selectedDate />
                        <TimeSlotPicker
                            on:selectTimeSlot={handleTimeSlotSelect}
                            {selectedTimeSlot}
                            {selectedDate}
                            bookedSlots={assetBookings[selectedDate]}
                        />
                    </div>

                    <div class="mt-6 border-t pt-6">
                        {#if validationError}
                            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                                {validationError}
                            </div>
                        {/if}
                        <button
                            on:click={handleBookingSubmit}
                            class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Book Asset
                        </button>
                    </div>
                </div>
            {:else}
                 <div class="bg-white p-12 rounded-2xl shadow-lg text-center h-full flex flex-col justify-center items-center">
                    <h3 class="text-xl font-semibold text-gray-700">Select an Asset to Begin</h3>
                </div>
            {/if}
        </div>
    </div>
</main>
