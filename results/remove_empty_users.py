import json

def delete_empty_objects(filename):
    """
    Python script that reads a JSON file and deletes 
    dictionaries containing "userId" and "startTime" keys only
    NB:
    The output isn't prettified to save space and process time in the frontend side
    """
    # Open the JSON file and load the contents into a list of dictionaries
    with open(filename, 'r') as f:
        data = json.load(f)

    orig_dict_len = len(data['results'])
    print(f"Number of objects before deletion: {orig_dict_len}")

    # Iterate over the list of dictionaries and remove the ones with "userId" and "startTime" keys only
    cleaned_data = {"results": []}
    for item in data["results"]:
        if set(item.keys()) != {'userId', 'startTime'}:
            cleaned_data['results'].append(item)

    cleaned_dict_len = len(cleaned_data['results'])
    print(f"Number of objects after deletion: {cleaned_dict_len}")
    print(f"Number of empty users: {orig_dict_len - cleaned_dict_len}")

    # Write the filtered data back to the JSON file
    with open(filename, 'w') as f:
        json.dump(cleaned_data, f)


delete_empty_objects('your_results.json')
