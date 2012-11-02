exports.HashMap = function()
{
  
    var ItemCollection=new Array();
    //private
    
    this.getMapCollection=function ()
    {
        return ItemCollection;
    }

    var MapItem=function (key,value)
    {
        
        this.key=(key===null?"":key);        
        this.value=(value===null?"":value);        
        
        this.getKey=function (){
            return this.key;            
        }
        
        this.getValue=function (){
            return this.value;            
        }
        
        this.setKey=function (key){
            this.key=key;            
        }
        
        this.setValue=function (value){
            this.value=value;            
        }
    }
    
    this.put=function (key,value)
    {
        var item=new MapItem();        
        if(isItemExist(key)===false)
        {
            item.setKey(key);            
            item.setValue(value);            
            ItemCollection[ItemCollection.length]=item;            
        }else {
            item=getItem(key);            
            item.setValue(value);            
        }
    }
    
    this.putAll=function (itemCollection)
    {
        if (HashMap.prototype.isPrototypeOf(itemCollection))
        {
            connectMap(itemCollection.getMapCollection());
            
            return true;

        } else {
            if (Array.prototype.isPrototypeOf(itemCollection))
            {
                for (var j=0;j<itemCollection.length ;j++ )
                {
                    if (MapItem.prototype.isPrototypeOf(itemCollection[j])===false)
                    {
                        return false;
                    }
                }

                connectMap(itemCollection);
                
                return true;
            }
        }
    }

    var connectMap=function (itemsArray)
    {
        if (ItemCollection.length===0)
        {
            for (var i=0;i<itemsArray.length;i++)
            {
                ItemCollection[i]=itemsArray[i];
            }
        } else {
            var j= (parseInt(itemsArray.length)+parseInt(ItemCollection.length));
            var orginalLength=parseInt(ItemCollection.length);
            
            for (var i=parseInt(ItemCollection.length) ; i<j; i++ )
            {
                ItemCollection[i]=itemsArray[i-orginalLength];
            }
        }
    }

    var getItem=function (key)
    {
        var item=new MapItem();        
        
        for(var i=0;i<ItemCollection.length;i++)
        {
            if(ItemCollection[i].getKey()===key)
            {
                item=ItemCollection[i];                
                break;                
            }
        }
        return item;        
    }

    this.getKeyFromIndex=function (index)
    {
        var key="";        

        if(index >= 0 && index < ItemCollection.length)
        {
            key = ItemCollection[index].getKey();
        }        

        return key;        
    }

    this.getValueFromIndex=function (index)
    {
        var value="";        

        if(index >= 0 && index < ItemCollection.length)
        {
            value = ItemCollection[index].getValue();
        }

        return value;        
    }
    
    this.get=function (key)
    {
        
        var value="";        
        
        for(var i=0;i<ItemCollection.length;i++)
        {
            if(ItemCollection[i].getKey()===key)
            {
                value=ItemCollection[i].getValue();                
                break;                
            }
        }
        return value;        
    }
    
    var isItemExist=function (key)
    {     
        var flag=false;        
        
        for(var i=0;i<ItemCollection.length;i++)
        {
            
            if(ItemCollection[i].getKey()===key)
            {
                flag=true;                
                break;    
            }
            
        }
        
        return flag;        
    }    

    this.remove=function (key)
    {
        for (var i=0;i<ItemCollection.length;i++)
        {            
            if (ItemCollection[i].getKey()===key)
            {
                for (var j=i;j<ItemCollection.length ;j++ )
                {
                    ItemCollection[j]=ItemCollection[j+1];
                }            
                ItemCollection.length=ItemCollection.length-1;
            }
        }
    }

    this.removeAll=function ()
    {
        ItemCollection.length=0;
    }

    this.getSize=function ()
    {
        return ItemCollection.length;        
    }


    this.contain=function (key)
    {
        for (var i=0;i<ItemCollection.length ;i++ )
        {
            if (ItemCollection[i].getKey()===key)
            {
                return true;
            }
        }

        return false;
    }

}

