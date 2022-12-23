import { dataChangeTracker } from "./data-tracker.util";

describe("data tracker tests", () => {
  test("primative data change", () => {
    let data: string = "test";
    let uuid = dataChangeTracker.registerData(data);
    data = "test2";
    expect(dataChangeTracker.isDataChanged(uuid, data)).toBeTruthy();
  });

  test("when manual id is set", () => {
    let data: string = "test";
    dataChangeTracker.registerData(data, "1");
    data = "test2";
    expect(dataChangeTracker.isDataChanged("1", data)).toBeTruthy();
  });

  test("primative data not changed", () => {
    let data: string = "test";
    let uuid = dataChangeTracker.registerData(data);
    data = "test2";
    data = "test";
    expect(dataChangeTracker.isDataChanged(uuid, data)).toBeFalsy();
  });

  test("object data change", () => {
    let data: any = {
      name: "salih",
      surname: "sayer",
    };

    let uuid = dataChangeTracker.registerData(data);
    data.name = "baki";
    expect(dataChangeTracker.isDataChanged(uuid, data)).toBeTruthy();
  });

  test("nest object change", () => {
    let data: any = {
      users: [
        {
          id: 1,
          name: "salih",
          comments: [
            {
              id: 1,
              text: "test",
            },
          ],
        },
      ],
    };

    let uuid = dataChangeTracker.registerData(data);
    data.users[0].comments[0].text = "test2";
    expect(dataChangeTracker.isDataChanged(uuid, data)).toBeTruthy();
  });
});
